read_filename = "data"
fo = open(read_filename, "w")
for i in range(0, 9):
    filename = "data" + str(i)
    fo2 = open(filename, "r")
    for line in fo2:
       fo.write(line)
    fo2.close()
fo.close()
