import csv
import json

datas = []
format  = "  %-30.30s  %-20.20s  %-10.10s  %-60.60s  %15.15s   %-15.15s  %-10.10s "
numLine = 0

for line in csv.reader( open("epa-http.txt",encoding="utf-8",newline=""), delimiter=" " ):
    if len(line) == 5:
        host, time, preURL, result, size = line
    elif len(line) == 6:
        host, time, preURL, result, size, dum = line
        ###CSV parsing failed. Compress columns.
        preURL += result
        result = size
        size = dum
    else:
        ###Irregular data. Happily this line will not execute for this .txt
        host ,time, preURL, result, size = ["*","*","*","*","*"]

    # Splitting preURL
    s = preURL.split()

    if  len( s ) == 3:
        method, URL, protocol = s
    elif len(s)<3:
        if len(s) == 2:
            if s[1].find('HTTP') == -1:
                method, URL, protocol = [s[0],s[1],"*"];
            else:
                ss = s[1].split('HTTP')
                method, URL, protocol = [s[0],ss[0],"HTTP" + ss[1]];
        if len(s) == 1:
            method, URL, protocol = ["*",s[0],"*"];
    elif len(s)>3:
        if(s[len(s)-1].find('HTTP') == -1):
            method, URL, protocol = [s[0],' '.join(str(s[k]) for k in range(1,len(s))),"*"];
        else:
            method, URL, protocol = [s[0],' '.join(str(s[k]) for k in range(1,len(s)-1)),s[len(s)-1]];
    else:
        method, URL, protocol = ["*","*","*"];
        
    print( format % ( host ,time ,method, URL, protocol ,result ,size ))

    ##Generate the json file
    splitDate = time.translate({ord('['): None}).translate({ord(']'): None}).split(':')
    splitProtocol = protocol.split('/')
    datas.append({
        "host": host,
        "datetime": {
            "day": splitDate[0],
            "hour": splitDate[1],
            "minute": splitDate[2],
            "second": splitDate[3],
            },
        "request":{
            "method": method,
            "url": URL,
            "protocol": splitProtocol[0],
            "protocol_version": splitProtocol[1] if len(splitProtocol) > 1 else "*"
            },
        "response_code": result,
        "document_size": size
    })
    numLine += 1;

with open("epa-http.json", "w") as outfile:
    json.dump(datas, outfile, indent=4)
