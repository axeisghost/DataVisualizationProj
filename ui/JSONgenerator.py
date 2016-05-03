import ast
import Queue

rawData = open('3_data', 'r')
outputData = open('tempt', 'w')
hero_dic = {};
combs = [];

for line in rawData:
	line = ast.literal_eval(line)
	if not hero_dic.has_key(line['first_hero_id']):
		hero_dic[line['first_hero_id']] = line['first_hero']
	if not hero_dic.has_key(line['second_hero_id']):
		hero_dic[line['second_hero_id']] = line['second_hero']
	if not hero_dic.has_key(line['third_hero_id']):
		hero_dic[line['third_hero_id']] = line['third_hero']
	combs.append({'first_hero': line['first_hero_id'],
				  'second_hero': line['second_hero_id'],
				  'third_hero': line['third_hero_id'],
				  'win_rate': line['win_rate'],
				  'frequency': line['combination_rate'],
				  'game': line['combination_games']})
class combo(object):
	def __init__(self, ida, idb, idc, wr, pr, game):
		self.firstID = ida
		self.secondID = idb
		self.thirdID = idc
		self.winrate = wr
		self.pickrate = pr
		self.game = game
	def __cmp__(self, other):
		return cmp(self.winrate, other.winrate)

queue = Queue.PriorityQueue(maxsize = 10)
rawData.close()
outputData.write('{' + '\n')
outputData.write('"threeCombo": [' + '\n')
current = combs[0]
queue.put(combo(current["first_hero"], current["second_hero"], current['third_hero'], current["win_rate"], current["frequency"], current["game"]))
for item in combs:
	if queue.qsize() < 10:
		if item['game'] >= 20:
			queue.put(combo(item["first_hero"], item["second_hero"], item['third_hero'], item["win_rate"], item["frequency"], current["game"]))
	else:
		current = queue.queue[0]
		if item['game'] >= 20:
			if current.winrate < item["win_rate"]:
				queue.get()
				queue.put(combo(item["first_hero"], item["second_hero"], item['third_hero'], item["win_rate"], item["frequency"], item["game"]))
while queue.qsize() > 0:
	current = queue.get()
	outputData.write('{"first_hero_ID":' + str(current.firstID)
		+ ', "second_hero_ID":' + str(current.secondID)
		+ ', "third_hero_ID":' + str(current.thirdID)
		+ ', "win_rate":' + str(current.winrate)
		+ ', "frequency":' + str(current.pickrate)
		+ ', "games":' + str(current.game)
		+ '},\n')
outputData.write(']' + '\n')
# outputData.write('"links": [')
# for idx in range(0, len(combs)):
# 	outputData.write('{"source":' + str(combs[idx]['source']) 
# 				   + ',"target":' + str(combs[idx]['target'])
# 				   + ',"win_rate":' + str(combs[idx]['win_rate'])
# 				   + ',"frequency":' + str(combs[idx]['frequency'])
# 				   + '}')
# 	if idx < len(combs) - 1:
# 		outputData.write(',')
# 	outputData.write('\n')
# outputData.write(']' + '\n')
rawData_b = open('2_data', 'r')
hero_dic_b = {};
combs_b = [];

for line in rawData_b:
	line = ast.literal_eval(line)
	# if (line['first_hero_id'] > 24):
	# 	line['first_hero_id'] = line['first_hero_id'] - 1
	# if (line['second_hero_id'] > 24):
	# 	line['second_hero_id'] = line['second_hero_id'] - 1
	# if (line['first_hero_id'] > 107):
	# 	line['first_hero_id'] = line['first_hero_id'] - 1
	# if (line['second_hero_id'] > 107):
	# 	line['second_hero_id'] = line['second_hero_id'] - 1
	# line['first_hero_id'] = line['first_hero_id']
	# line['second_hero_id'] = line['second_hero_id']
	if not hero_dic_b.has_key(line['first_hero_id']):
		hero_dic_b[line['first_hero_id']] = line['first_hero']
	if not hero_dic_b.has_key(line['second_hero_id']):
		hero_dic_b[line['second_hero_id']] = line['second_hero']
	combs_b.append({'first_hero': line['first_hero_id'],
				  'second_hero': line['second_hero_id'],
				  'win_rate': line['win_rate'],
				  'frequency': line['combination_rate'],
				  'game': line['combination_games']})
class combo_b(object):
	def __init__(self, ida, idb, wr, pr, game):
		self.firstID = ida
		self.secondID = idb
		self.winrate = wr
		self.pickrate = pr
		self.game = game
	def __cmp__(self, other):
		return cmp(self.winrate, other.winrate)

queue = Queue.PriorityQueue(maxsize = 10)
rawData_b.close()
outputData.write('{' + '\n')
outputData.write('"twoCombo": [' + '\n')
# print hero_dic[37]
# print hero_dic[68]
# print len(combs)
# print len(hero_dic)
current = combs_b[0]
maxx = 0
queue.put(combo_b(current["first_hero"], current["second_hero"], current["win_rate"], current["frequency"], current["game"]))
for item in combs_b:
	if item["game"] > maxx:
		maxx = item["game"]
	if queue.qsize() < 10:
		if item['game'] >= 1000:
			queue.put(combo_b(item["first_hero"], item["second_hero"], item["win_rate"], item["frequency"], item["game"]))
	else:
		if item['game'] >= 1000:
			current = queue.queue[0]
			if current.winrate < item["win_rate"]:
				queue.get()
				queue.put(combo_b(item["first_hero"], item["second_hero"], item["win_rate"], item["frequency"], item["game"]))
while queue.qsize() > 0:
	current = queue.get()
	outputData.write('{"first_hero_id":' + str(current.firstID)
		+ ', "second_hero_id":' + str(current.secondID)
		+ ', "win_rate":' + str(current.winrate)
		+ ', "frequency":' + str(current.pickrate)
		+ ', "games":' + str(current.game)
		+ '},\n')
outputData.write(']' + '\n')
outputData.write('}' + '\n')
outputData.close()

