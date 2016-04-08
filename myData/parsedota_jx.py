import ast, sys, json

from threading import Thread

def main():
        
    read_filename = "data"
    fo = open("hero_list", "r")
    hero_list = ""
    for line in fo:
        hero_list = hero_list + line
    global_hero_list = json.loads(hero_list)
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
    win_heroes = []
    lose_heroes = []
    for line in fo:
        total_matches = total_matches + 1
        line = ast.literal_eval(line) # Converted to dict
        if line['winner'] == 'Radiant':
            radiant_win = radiant_win+1
            win_heroes.append(line['radiant_heroes'])
            lose_heroes.append(line['dire_heroes'])
        else:
            dire_win = dire_win+1
            win_heroes.append(line['dire_heroes'])
            lose_heroes.append(line['radiant_heroes'])

    two_dict_win = {}
    two_dict_lose = {}
    three_dict_win = {}
    three_dict_lose = {}
    four_dict_win = {}
    four_dict_lose = {}
    five_dict_win = {}
    five_dict_lose = {}
    count = 0
    for each in win_heroes:
        each.sort()
        count = count + 1
        print(count)
        for i in range(0, 5):
            for j in range(i+1, 5):
                if (each[i], each[j]) not in two_dict_win.keys():
                    two_dict_win[(each[i], each[j])] = 1
                else:
                    two_dict_win[(each[i], each[j])] = two_dict_win[(each[i], each[j])] + 1
                for k in range(j+1, 5):
                    if (each[i], each[j], each[k]) not in three_dict_win.keys():
                        three_dict_win[(each[i], each[j], each[k])] = 1
                    else:
                        three_dict_win[(each[i], each[j], each[k])] = three_dict_win[(each[i], each[j], each[k])] + 1
                    for l in range(k+1, 5):
                        if (each[i], each[j], each[k], each[l]) not in four_dict_win.keys():
                            four_dict_win[(each[i], each[j], each[k], each[l])] = 1
                        else:
                            four_dict_win[(each[i], each[j], each[k], each[l])] = four_dict_win[(each[i], each[j], each[k], each[l])] + 1
                        if (each[i], each[j], each[k], each[l], each[4]) not in five_dict_win.keys():
                            five_dict_win[(each[i], each[j], each[k], each[l], each[4])] = 1
                        else:
                            five_dict_win[(each[i], each[j], each[k], each[l], each[4])] = five_dict_win[(each[i], each[j], each[k], each[l], each[4])] + 1
    for each in lose_heroes:
        each.sort()
        count = count + 1
        print(count)
        for i in range(0, 5):
            for j in range(i+1, 5):
                if (each[i], each[j]) not in two_dict_lose.keys():
                    two_dict_lose[(each[i], each[j])] = 1
                else:
                    two_dict_lose[(each[i], each[j])] = two_dict_lose[(each[i], each[j])] + 1
                for k in range(j+1, 5):
                    if (each[i], each[j], each[k]) not in three_dict_lose.keys():
                        three_dict_lose[(each[i], each[j], each[k])] = 1
                    else:
                        three_dict_lose[(each[i], each[j], each[k])] = three_dict_lose[(each[i], each[j], each[k])] + 1
                    for l in range(k+1, 5):
                        if (each[i], each[j], each[k], each[l]) not in four_dict_lose.keys():
                            four_dict_lose[(each[i], each[j], each[k], each[l])] = 1
                        else:
                            four_dict_lose[(each[i], each[j], each[k], each[l])] = four_dict_lose[(each[i], each[j], each[k], each[l])] + 1
                        if (each[i], each[j], each[k], each[l], each[4]) not in five_dict_lose.keys():
                            five_dict_lose[(each[i], each[j], each[k], each[l], each[4])] = 1
                        else:
                            five_dict_lose[(each[i], each[j], each[k], each[l], each[4])] = five_dict_lose[(each[i], each[j], each[k], each[l], each[4])] + 1

    two_dict = two_dict_win.copy()
    two_dict.update(two_dict_lose)

    for each in two_dict.keys():
        dict = {}
        dict['first_hero_id'] = each[0]
        dict['second_hero_id'] = each[1]
        dict['first_hero'] = findHeroNameByID(each[0])
        dict['second_hero'] = findHeroNameByID(each[1])
        if (two_dict_win.get(each) != None):
            win_games = two_dict_win.get(each)
        else:
            win_games = 0
        dict['win_games'] = win_games
        if (two_dict_lose.get(each) != None):
            lose_games = two_dict_lose.get(each)
        else:
            lose_games = 0
        
        dict['combination_games'] = win_games + lose_games
        dict['win_rate'] = (float)(win_games)/(win_games+lose_games)*100
        dict['combination_rate'] = (float)(win_games+lose_games)/total_matches*100
        fo2.write(str(dict) + "\n")

    three_dict = three_dict_win.copy()
    three_dict.update(three_dict_lose)

    for each in three_dict.keys():
        dict = {}
        dict['first_hero_id'] = each[0]
        dict['second_hero_id'] = each[1]
        dict['third_hero_id'] = each[2]
        dict['first_hero'] = findHeroNameByID(each[0])
        dict['second_hero'] = findHeroNameByID(each[1])
        dict['third_hero'] = findHeroNameByID(each[2])
        if (three_dict_win.get(each) != None):
            win_games = three_dict_win.get(each)
        else:
            win_games = 0
        dict['win_games'] = win_games
        if (three_dict_lose.get(each) != None):
            lose_games = three_dict_lose.get(each)
        else:
            lose_games = 0
        
        dict['combination_games'] = win_games + lose_games
        dict['win_rate'] = (float)(win_games)/(win_games+lose_games)*100
        dict['combination_rate'] = (float)(win_games+lose_games)/total_matches*100
        fo3.write(str(dict) + "\n")

    four_dict = four_dict_win.copy()
    four_dict.update(four_dict_lose)

    for each in four_dict.keys():
        dict = {}
        dict['first_hero_id'] = each[0]
        dict['second_hero_id'] = each[1]
        dict['third_hero_id'] = each[2]
        dict['forth_hero_id'] = each[3]
        dict['first_hero'] = findHeroNameByID(each[0])
        dict['second_hero'] = findHeroNameByID(each[1])
        dict['third_hero'] = findHeroNameByID(each[2])
        dict['forth_hero'] = findHeroNameByID(each[3])
        if (four_dict_win.get(each) != None):
            win_games = four_dict_win.get(each)
        else:
            win_games = 0
        dict['win_games'] = win_games
        if (four_dict_lose.get(each) != None):
            lose_games = four_dict_lose.get(each)
        else:
            lose_games = 0
        
        dict['combination_games'] = win_games + lose_games
        dict['win_rate'] = (float)(win_games)/(win_games+lose_games)*100
        dict['combination_rate'] = (float)(win_games+lose_games)/total_matches*100
        fo4.write(str(dict) + "\n")

    five_dict = five_dict_win.copy()
    five_dict.update(five_dict_lose)

    for each in five_dict.keys():
        dict = {}
        dict['first_hero_id'] = each[0]
        dict['second_hero_id'] = each[1]
        dict['third_hero_id'] = each[2]
        dict['forth_hero_id'] = each[3]
        dict['fifth_hero_id'] = each[4]
        dict['first_hero'] = findHeroNameByID(each[0])
        dict['second_hero'] = findHeroNameByID(each[1])
        dict['third_hero'] = findHeroNameByID(each[2])
        dict['forth_hero'] = findHeroNameByID(each[3])
        dict['fifth_hero'] = findHeroNameByID(each[4])
        if (five_dict_win.get(each) != None):
            win_games = five_dict_win.get(each)
        else:
            win_games = 0
        dict['win_games'] = win_games
        if (five_dict_lose.get(each) != None):
            lose_games = five_dict_lose.get(each)
        else:
            lose_games = 0
        
        dict['combination_games'] = win_games + lose_games
        dict['win_rate'] = (float)(win_games)/(win_games+lose_games)*100
        dict['combination_rate'] = (float)(win_games+lose_games)/total_matches*100
        fo5.write(str(dict) + "\n")
    
        
    fo.close()
    fo2.close()
    fo3.close()
    fo4.close()
    fo5.close()  

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
                    return hero


if __name__ == "__main__":
    main()
