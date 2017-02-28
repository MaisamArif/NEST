from django.http import HttpResponse
import json

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
