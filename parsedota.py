import ast, sys, json

from threading import Thread

def main():
    read_filename = "data"
    fo = open(read_filename, "w")
    for i in range(0, 9):
        filename = "data" + str(i)
        fo2 = open(filename, "r")
        for line in fo2:
           fo.write(line)
        fo2.close()
    fo.close()
    
    two_filename = "2_data"
    three_filename = "3_data"
    four_filename = "4_data"
    five_filename = "5_data"
    fo = open(read_filename, "r")
    fo2 = open(two_filename, "w")
    fo3 = open(three_filename, "w")
    fo4 = open(four_filename, "w")
    fo5 = open(five_filename, "w")

    total_matches = 0
    radiant_win = 0
    dire_win = 0
    winning_heroes = []
    lose_heroes = []
    for line in fo:
        total_matches = total_matches + 1
        line = ast.literal_eval(line) # Converted to dict
        if line['winner'] == 'Radiant':
            radiant_win = radiant_win+1
            winning_heroes.append(line['radiant_heroes'])
            lose_heroes.append(line['dire_heroes'])
        else:
            dire_win = dire_win+1
            winning_heroes.append(line['dire_heroes'])
            lose_heroes.append(line['radiant_heroes'])
    dict = {}
    dict['total_matches'] = total_matches
    dict['radiant_win_rate'] = (float)(radiant_win)/total_matches
    dict['dire_win_rate'] = (float)(dire_win)/total_matches
    four_dict = {}
    ##find2HeroCombination(winning_heroes, lose_heroes, fo2, total_matches)

    t = Thread(target=find2HeroCombination, args=(winning_heroes, lose_heroes, fo2, total_matches))
    t.start()

    t = Thread(target=find3HeroCombination, args=(winning_heroes, lose_heroes, fo3, total_matches))
    t.start()
    
    for i in range(1,112):
        print("main: " + str(i))
        for j in range(i+1,112):
            for k in range(j+1, 112):
                for l in range(k+1, 112):
                    four_dict[(i,j,k,l)] = 0
                    if find4HeroCombination(i, j, k, l, winning_heroes, lose_heroes, fo4, total_matches):
                        four_dict[(i,j,k,l)] = 1
                        
    for j in four_dict:
        for m in range(1, 112):
            if m != j[0] and m != j[1] and m != j[2] and m != j[3]:
                find5HeroCombination(j[0], j[1], j[2], j[3], m, winning_heroes, lose_heroes, fo5, total_matches)
                
    fo.close()
    fo2.close()
    fo3.close()
    fo4.close()
    fo5.close()

def find2HeroCombination(winning_heroes, lose_heroes, fo2, total_matches):
    for a in range(1,112):
        print("Thread-1: " + str(a))
        for b in range(a+1,112):
            win_counter = 0
            lose_counter = 0
            for i in winning_heroes:
                if (a in i) and (b in i):
                    win_counter = win_counter + 1
            for i in lose_heroes:
                if (a in i) and (b in i):
                    lose_counter = lose_counter + 1
            all_counter = lose_counter + win_counter
            if (all_counter != 0):
                win_rate = (float)(win_counter)/all_counter
            else:
                win_rate = 0
            dict = {}
            dict['first_hero'] = findHeroNameByID(a)
            dict['second_hero'] = findHeroNameByID(b)
            dict['first_hero_id'] = a
            dict['second_hero_id'] = b
            dict['win_rate'] = win_rate*100
            dict['combination_rate'] = (float)(all_counter)/total_matches
            dict['combination_match'] = all_counter
            dict['total_match'] = total_matches
            dict['win_matches'] = win_counter
            fo2.write(str(dict) + "\n")

def find3HeroCombination(winning_heroes, lose_heroes, fo3, total_matches):
    for a in range(1,112):
        print("Thread-2: " + str(a))
        for b in range(a+1,112):
            for c in range(b+1, 112):
                win_counter = 0
                lose_counter = 0
                for i in winning_heroes:
                    if (a in i) and (b in i) and (c in i):
                        win_counter = win_counter + 1
                for i in lose_heroes:
                    if (a in i) and (b in i) and (c in i):
                        lose_counter = lose_counter + 1
                all_counter = lose_counter + win_counter
                if (all_counter != 0):
                    win_rate = (float)(win_counter)/all_counter
                else:
                    win_rate = 0
                dict = {}
                dict['first_hero'] = findHeroNameByID(a)
                dict['second_hero'] = findHeroNameByID(b)
                dict['third_hero'] = findHeroNameByID(c)
                dict['first_hero_id'] = a
                dict['second_hero_id'] = b
                dict['third_hero_id'] = c
                dict['win_rate'] = win_rate*100
                dict['combination_rate'] = (float)(all_counter)/total_matches
                dict['combination_match'] = all_counter
                dict['total_match'] = total_matches
                dict['win_matches'] = win_counter
                fo3.write(str(dict) + "\n")

def find4HeroCombination(first, second, third, forth, winning_heroes, lose_heroes, fo4, total_matches):
    win_counter = 0
    lose_counter = 0
    returnValue = False
    for i in winning_heroes:
        if (first in i) and (second in i) and (third in i) and (forth in i):
            win_counter = win_counter + 1    
    for i in lose_heroes:
        if (first in i) and (second in i) and (third in i) and (forth in i):
            #fo2.write(str(i) + "\n")
            lose_counter = lose_counter + 1
            returnValue = True
    all_counter = win_counter + lose_counter
    if (all_counter != 0):
        win_rate = (float)(win_counter)/all_counter
        dict = {}
        dict['first_hero'] = findHeroNameByID(first)
        dict['second_hero'] = findHeroNameByID(second)
        dict['third_hero'] = findHeroNameByID(third)
        dict['forth_hero'] = findHeroNameByID(forth)
        dict['first_hero_id'] = first
        dict['second_hero_id'] = second
        dict['third_hero_id'] = third
        dict['forth_hero_id'] = forth
        dict['win_rate'] = win_rate*100
        dict['combination_rate'] = (float)(all_counter)/total_matches
        dict['combination_match'] = all_counter
        dict['total_match'] = total_matches
        dict['win_matches'] = win_counter
        fo4.write(str(dict) + "\n")
    return returnValue

def find5HeroCombination(first, second, third, forth, fifth, winning_heroes, lose_heroes, fo5, total_matches):
    win_counter = 0
    all_counter = 0
    for i in winning_heroes:
        if (first in i) and (second in i) and (third in i) and (forth in i) and (fifth in i):
            win_counter = win_counter + 1
    for i in lose_heroes:
        if (first in i) and (second in i) and (third in i) and (forth in i) and (fifth in i):
            all_counter = all_counter + 1
    if (all_counter != 0):
        win_rate = (float)(win_counter)/all_counter
        dict = {}
        dict['first_hero'] = findHeroNameByID(first)
        dict['second_hero'] = findHeroNameByID(second)
        dict['third_hero'] = findHeroNameByID(third)
        dict['forth_hero'] = findHeroNameByID(forth)
        dict['fifth_hero'] = findHeroNameByID(fifth)
        dict['first_hero_id'] = first
        dict['second_hero_id'] = second
        dict['third_hero_id'] = third
        dict['forth_hero_id'] = forth
        dict['fifth_hero_id'] = fifth
        dict['win_rate'] = win_rate*100
        dict['combination_rate'] = (float)(all_counter)/total_matches
        dict['combination_match'] = all_counter
        dict['total_match'] = total_matches
        dict['win_matches'] = win_counter
        fo5.write(str(dict) + "\n")    

def findHeroNameByID(index):
    fo = open("hero_list", "r")
    hero_list = ""
    for line in fo:
        hero_list = hero_list + line
    hero_list = json.loads(hero_list)
    hero = ""
    for i in hero_list["result"]["heroes"]:
            if i["id"] == index:
                    hero = i["localized_name"]
                    break
    return hero


if __name__ == "__main__":
    main()
