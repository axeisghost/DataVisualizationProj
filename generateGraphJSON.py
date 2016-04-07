import ast

# Parameter
winRateThershold = 0
freqThersold = 0
#
rawData = open('data/2_data', 'r')
outputData = open('graphData.json', 'w')
hero_dic = {};
combs = [];

for line in rawData:
	line = ast.literal_eval(line)
	if (line['first_hero_id'] > 24):
		line['first_hero_id'] = line['first_hero_id'] - 1
	if (line['second_hero_id'] > 24):
		line['second_hero_id'] = line['second_hero_id'] - 1
	if (line['first_hero_id'] > 107):
		line['first_hero_id'] = line['first_hero_id'] - 1
	if (line['second_hero_id'] > 107):
		line['second_hero_id'] = line['second_hero_id'] - 1
	line['first_hero_id'] = line['first_hero_id'] - 1
	line['second_hero_id'] = line['second_hero_id'] - 1
	if not hero_dic.has_key(line['first_hero_id']):
		hero_dic[line['first_hero_id']] = line['first_hero']
	if not hero_dic.has_key(line['second_hero_id']):
		hero_dic[line['second_hero_id']] = line['second_hero']
	combs.append({'source': line['first_hero_id'],
				  'target': line['second_hero_id'],
				  'win_rate': line['win_rate'],
				  'frequency': line['combination_rate']})

print hero_dic[37]
print hero_dic[68]
print len(combs)
print len(hero_dic)
rawData.close()
outputData.write('{' + '\n')
outputData.write('"nodes": [' + '\n')
for idx in range(0, len(hero_dic)):
	if hero_dic.has_key(idx):
		outputData.write('{"name":"' + hero_dic[idx] + '","group":1}')
		if idx < len(hero_dic) - 1:
			outputData.write(',')
		outputData.write('\n')
	else:
		print idx
outputData.write('],' + '\n')
outputData.write('"links": [')
for idx in range(0, len(combs)):
	outputData.write('{"source":' + str(combs[idx]['source']) 
				   + ',"target":' + str(combs[idx]['target'])
				   + ',"win_rate":' + str(combs[idx]['win_rate'])
				   + ',"frequency":' + str(combs[idx]['frequency'])
				   + '}')
	if idx < len(combs) - 1:
		outputData.write(',')
	outputData.write('\n')
outputData.write(']' + '\n')
outputData.write('}' + '\n')
outputData.close()

