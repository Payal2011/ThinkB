import pandas as pd
from flask_restful import Resource, Api
from flask_compress import Compress
from flask import Flask, request
from flask_cors import CORS
import json
import sqlite3


database = '../../../../inventory.db'

app = Flask(__name__)
api = Api(app)
app.config['JSON_SORT_KEYS'] = False

''' Cross origin support '''
CORS(app, resources={r"/*": {"origins": "*"}})

''' Compress response '''
COMPRESS_MIMETYPES = ['text/html', 'text/css', 'text/xml', 'application/json', 'application/javascript']
COMPRESS_LEVEL = 6
Compress(app)

   
@app.route('/insertRecord/', methods=['GET', 'POST'])
def write_sqlite():
    record= json.loads(request.form['data'])
    msg = {}
    try:
        conn = sqlite3.connect(database)
        cur = conn.cursor()
        insertRecord = "insert into inventoryDetails (name,desc,inventory,price,active) VALUES "+str(tuple(record.values()))
        cur.execute(insertRecord) 
        conn.commit()
        msg["status"] = "saved"
        return msg
    except Exception as err:
        msg["status"] = "not saved"
        return msg

@app.route('/getAllRecords/', methods=['GET', 'POST'])
def getRecords():
    msg={}
    try:
        conn = sqlite3.connect(database)
        query = "select * from inventoryDetails Order by id Desc"
        df = pd.read_sql(query,conn)
        table = df.to_json(orient = 'records')
        return table
    except Exception as err:
        msg["status"] = "no records"
        return msg


@app.route('/deleteRecord/', methods=['GET', 'POST'])
def deleteRecord():
    record= json.loads(request.form['data'])
    msg={}
    try:
        conn = sqlite3.connect(database)
        cur = conn.cursor()
        deleteRecord = "DELETE FROM inventoryDetails WHERE id="+str(record.get('id'))
        cur.execute(deleteRecord) 
        conn.commit()
        msg["status"] = "deleted"
        return msg
    except Exception as err:
        msg["status"] = "not deleted"
        return msg

@app.route('/updateRecord/', methods=['GET', 'POST'])
def updateRecord():
    record= json.loads(request.form['data'])
    msg = {}
    try:
        conn = sqlite3.connect(database)
        cur = conn.cursor()     
        updateRecord = "UPDATE inventoryDetails SET name ='"+str(record.get('name'))+"',desc='"+str(record.get('desc'))+"',price="+str(record.get('price'))+",active="+str(record.get('active'))+",inventory="+str(record.get('inventory'))+ " WHERE id ="+str(record.get('id'))
        cur.execute(updateRecord) 
        conn.commit()
        msg["status"] = "updated"
        return msg
    except Exception as err:
        msg["status"] = "not updated"
        return msg
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5004, threaded=True, debug=True)


#to run --->   http://localhost:5004/insertRecord/