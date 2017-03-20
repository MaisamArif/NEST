import numpy as np
import random

def normalize(arr):
    s = sum(arr)

    if s == 0:
        s = 1
        arr[0] = 1

    for i, val in enumerate(arr):
        arr[i] = val/s


def generate(width, height):
    matrix = []

    for i in range(height):
        matrix.append([])

        for j in range(width):
            matrix[i].append(float(random.randint(0, 1000))/1000)

        normalize(matrix[i])

        matrix[i] = [round(x, 3) for x in matrix[i]]

    return np.matrix(matrix)

def initialize(soc0, soc1):
    matricies = []

    for i in range(4):
        matricies.append(generate(4,4))
    #format is as follows [P0, IM0, P1, IM1]

    P0, IM0, P1, IM1 = matricies

    vm1 =  IM1[0:,0] * IM0[0,0:] + IM1[0:,1] * IM0[1,0:] + IM1[0:,2] * IM0[2,0:] +IM1[0:,3] * IM0[3,0:]
    vm2 =  IM0[0:,0] * IM1[0,0:] + IM0[0:,1] * IM1[1,0:] + IM0[0:,2] * IM1[2,0:] +IM0[0:,3] * IM1[3,0:]
    
    c0_to_c1 = ((1-soc0) * P0)+ (soc0 * vm1)
    c1_to_c0 = ((1-soc1) * P1)+ (soc1 * vm2)

    matricies.append(c0_to_c1)
    matricies.append(c1_to_c0)

    if random.randint(0,1) == 1:
        position_and_direction = ['right', 'left', 'left', 'right']
    else:
        position_and_direction = ['left', 'right', 'right', 'left']

    return matricies#, position_and_direction

def traverse(matrix):
    rand  = float(random.randint(0,1000))/1000
    count = 0
    for i, elem in enumerate(matrix):
        if rand > count and rand < count + elem:
            return i
        count += elem
    return len(matrix) - 1


def continue_chain(emo1, emo2, matricies):
    T1, T2 = matricies
    
    if random.randint(0,1) == 1:
        position_and_direction = ['right', 'left', 'left', 'right']
    else:
        position_and_direction = ['left', 'right', 'right', 'left']

    return (traverse(T1.A[emo1]), traverse(T2.A[emo2]))#, position_and_direction 


if __name__ == "__main__":
    pass
def main():
    pass
