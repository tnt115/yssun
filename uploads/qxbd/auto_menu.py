#!/usr/bin/python
#coding=utf-8 
'''
Created on 2018-1-24

@author: admin
'''

import os,sys,urllib,json
reload(sys)

print '------start--------'


dir_list = os.listdir(unicode(os.getcwd(),"utf-8"))


for diritem in dir_list:
    print diritem

jsonstring = "{\"strSubject\":\"标题\",\"serverSubUrl\":\"xxxxx\",\"data\":["
for diritem in dir_list:
    if(diritem=='menu.json'):
        continue
    if(diritem=='auto_menu.py'):
        continue
    diritem=diritem.encode("utf-8") 
    jsonstring+= "{\"url\":"+"\""+diritem+"\",\"title\":\""+diritem+"\""+"},"
    
jsonstring = jsonstring[0:len(jsonstring)-1]+"]}"
print jsonstring
f = open('menu.json','w')
f.write(jsonstring)
f.close()

print '******生成menu.json完成********************'