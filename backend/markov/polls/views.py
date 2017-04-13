from django.http import HttpResponse
import json
import random
import ast
import numpy as np
from polls.models import Story, CharacterObjects, Frame, Character

# Create your views here.
def index(request):
    #example of json
    
    return HttpResponse("FIGHTME IRL")

def json_shit(request):    
    some_dict = {
            "some":"body",
            "once":"told me",
    }
    return HttpResponse(json.dumps(some_dict))

def translate(num):
    if num == 0:
        return "Happy"
    if num == 1:
        return "Sad"
    if num == 2:
        return "Angry"
    if num == 3:
        return "Fear"     
    
def translate_to_num(stringy):
    if stringy == "Happy":
        return 0
    if stringy == "Sad":
        return 1
    if stringy == "Angry":
        return 2
    if stringy == "Fear":
        return 3



############################################################
#                     MARKOV GENERATOR
############################################################
class MarkovGenerator:
    def normalize(self, arr):
        s = sum(arr)
        if s == 0:
            s = 1
            arr[0] = 1
        
        for i, val in enumerate(arr):
            arr[i] = val/s
        return arr
    
    
    def generate(self, width, height):
        matrix = []
    
        for i in range(height):
            matrix.append([])
    
            for j in range(width):
                matrix[i].append(float(random.randint(0, 1000))/1000)
    
            matrix[i] = self.normalize(matrix[i])
    
            matrix[i] = [round(x, 3) for x in matrix[i]]
            
        return np.matrix(matrix)


    def initialize(self, num):
        out_matricies = []
        
        for i in range(num * 2):
            out_matricies.append(self.generate(4,4))
        
        closeness_vectors = []
        for x in range(num):
            close_vector = []
            for i in range(num):
                if i == x:
                    close_vector.append(float(0))
                else:
                    close_vector.append(float(random.randint(0,1000))/1000)
            closeness_vectors.append(self.normalize(close_vector))
        return out_matricies, closeness_vectors

    
    def traverse_row(self, matrix):
        rand  = float(random.randint(0,1000))/1000
        count = 0
        for i, elem in enumerate(matrix):
            if rand > count and rand < count + elem:
                return i
            count += elem
        return len(matrix) - 1


    #This takes in one character, all the other characters in the frame, and 
    #all the matricies for every character
    def new_emotion_one_character(self,
                                  character_acting_id,    #id of acting character in frame
                                  characters_in_frame_ids, #id of other characters in frame
                                  char_emotions,          #array of emotions of characters in frame
                                  personality_matricies,  #array of personality matricies of characters in frame
                                  impact_matricies,       #array of impact matricies of characters in frame
                                  socialbility_params,    #array of socialbility of characters in frame
                                  closeness_vectors):     #array of closeness vectors of characters in frame
        
        if len(characters_in_frame_ids) == 0:
            P0   = personality_matricies[character_acting_id]
            emo0 = char_emotions[character_acting_id]
            
            if random.randint(0,1) == 1:
                direction = 'right'
            else:
                direction = 'left'
            
            return (self.traverse_row(P0.A[emo0]), direction)
        
        else:
            P0   = personality_matricies[character_acting_id]
            emo0 = char_emotions[character_acting_id]
            s0   = socialbility_params[character_acting_id]
            
            if random.randint(0,1) == 1:
                direction = 'right'
            else:
                direction = 'left'
            
            total_influence = np.matrix([[0.0, 0.0, 0.0, 0.0],
                                         [0.0, 0.0, 0.0, 0.0],
                                         [0.0, 0.0, 0.0, 0.0],
                                         [0.0, 0.0, 0.0, 0.0]])
            
            for elem in characters_in_frame_ids:
                M = impact_matricies[elem].A[char_emotions[elem]]
                v = closeness_vectors[character_acting_id][elem]
                M = np.repeat(M[np.newaxis,:], 4, 0)
                total_influence += v*M
        
            transition_matrix = (1-s0) * P0 + s0 *(total_influence)
        
            return(self.traverse_row(transition_matrix.A[emo0]), direction)

############################################################
#                     INITIALIZATION
############################################################

def Initialization(request):
   
    string   = ast.literal_eval(request.body)
    username = string['Details']['Username']
    story    = string['Details']['Story']
    num_char = len(string['Characters'])

    s = Story(story_name = story, user_name = username)
    s.save()
    
    matrices, closeness_vectors = MarkovGenerator.initialize(num_char)
    
    #Initialize DB
    char_id = 0
    for elem in string['Characters']:
        
        name         = elem['Name']
        position     = elem['Position']
        socialbility = elem['Social']
        emotion      = translate_to_num(elem['Emotion'])
        personality  = matrices[char_id]
        impact       = matrices[char_id + num_char]
        c_vector     = closeness_vectors[char_id]
            
        c = CharacterObjects(story           = s,
                             character_id    = char_id,
                             name            = name,
                             position        = position,
                             socialbility    = socialbility,
                             recent_emotion  = emotion,
                             personality     = json.dumps(personality.tolist()),
                             impact          = json.dumps(impact.tolist()),
                             closeness       = json.dumps(c_vector))
        c.save()

        char_id += 1
        
    return HttpResponse(generate_response(username,story,0,0))

############################################################
#                     UPDATE TEXT
############################################################

def UpdateText(request):
    
    string     = ast.literal_eval(request.body)
    username   = string['Details']['Username']
    story      = string['Details']['Story']
    start      = string['Details']['Frame_start']
    end        = string['Details']['Frame_end']
    
    s = Story.objects.get(story_name = story, user_name = username)
    
    last_known_frame = len(s.frame_set.all())
    #get number of the last frame from db
    if last_known_frame < int(end):
        return generate_response(username,story,0,0)
    else:
        #return JSON wanted

        frames = s.frame_set.order_by('frame_id')

        for elem in string['Frames']:
            f = frames[start]
            for sub_elem in elem['Characters']:
                
                char_name = sub_elem['Name']
                text      = sub_elem['Text']
                
                c = f.character_set.get(name = char_name)
                c.text = text
                c.save()
            
            start += 1
            if start > end:
                break
            
    return generate_response(username,story,start,end)

############################################################
#                     Continue Past Story
############################################################

def Continue(request):

    #Load Json and variables
    string   = ast.literal_eval(request.body)
    username = string['Details']['Username']
    story    = string['Details']['Story']
    start    = string['Details']['Frame_start']
    end      = string['Details']['Frame_end']
    
    #getting the story and basic data for accessing the db
    s                = Story.objects.get(story_name = story, user_name = username)
    last_known_frame = len(s.frame_set.all())
    char_objs        = s.characterobjects_set.order_by('character_id')       

    #FRAMES
    for elem in range(last_known_frame + 1, end + 1):
        frame = Frame(background_image = 'http://34.208.169.220/mint_background.jpg', frame_id = elem, story = s)
        frame.save()

        #change to this if we start doing more than 2 characters a frame
        #num_characters_in_frame = random.randint(1,len(char_objs))
        num_characters_in_frame = 2
        
        chars_in_frame = random.sample([char_obj.character_id for char_obj in char_objs],
                                       num_characters_in_frame)

        emotions          = [char_obj.recent_emotion for char_obj in char_objs]
        personality       = [np.matrix(json.loads(char_obj.personality)) for char_obj in char_objs]
        impact            = [np.matrix(json.loads(char_obj.impact)) for char_obj in char_objs]
        socialbility      = [char_obj.socialbility for char_obj in char_objs]
        closeness_vectors = [json.loads(char_objs.closeness) for char_obj in char_objs]

        #CHARACTERS IN FRAME
        for elem in chars_in_frame:
            c1       = elem
            c2       = list(filter(lambda x: not x == c1, chars_in_frame))

            emotion, direction = MarkovGenerator.new_emotion_one_character(
                                                      c1,
                                                      c2,
                                                      emotions,
                                                      personality,
                                                      impact,
                                                      socialbility,
                                                      closeness_vectors)
            #not sure if char_objs[c1].name works
            c = Character(name = char_objs[c1].name, direction = direction, text = '', emotion = emotion, frame = frame)
            c.save()

            char_objs[c1].recent_emotion = emotion 
            char_objs[c1].save()

    return generate_response(username, story, start, end)

############################################################
#                     Generate Response
############################################################

def generate_response(username, story, frame_start, frame_end):
    url = 'http://34.208.169.220/'
    json_response = {'Details' : 
                       {"Story": story,
                        "Username": username,
                        "Frame_start": frame_start,
                        "Frame_end": frame_end
                       },
                     'Frames' : []
                    }

   
    s      = Story.objects.get(story_name = story, user_name = username)
    frames = s.frame_set.order_by('frame_id')

    count = 0
    for elem in range(frame_start, frame_end + 1):
        json_response['Frames'].append({})
        json_response['Frames'][count]['Background'] = {'Image_name' :  url + 'mint_background.jpg'}
        json_response['Frames'][count]['Characters'] = []
        
        #get the frame we want
        frame = frames.get(frame_id = elem)

        #add as many characters that are in the frame
        char_count = 0
        for char in frame.character_set.order_by('id'):
            json_response['Frames'][count]['Characters'].append({}) 
            json_response['Frames'][count]['Characters'][char_count]['Direction']  = char.direction
            json_response['Frames'][count]['Characters'][char_count]['Emotion']    = char.emotion
            json_response['Frames'][count]['Characters'][char_count]['Name']       = char.name
            json_response['Frames'][count]['Characters'][char_count]['Text']       = char.text
            json_response['Frames'][count]['Characters'][char_count]['URL']        = url + str.lower(char.name) + '/' + char.emotion + '.png'
            json_response['Frames'][count]['Characters'][char_count]['Mouthpoint'] = url + str.lower(char.name) + '/' + char.emotion + '_mouthpoint.txt'
            char_count += 1
            
        count += 1
        
    return json.dumps(json_response)
