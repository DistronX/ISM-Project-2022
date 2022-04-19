from flask import Flask,render_template,url_for,request,session,logging,redirect,flash
import os
import main
from flask import jsonify
app = Flask(__name__)


@app.route('/encryption',methods = ['POST', 'GET']) 
def encryption():      
  if request.method == 'POST':
        result = request.get_json()
        image = result['path']
        encrypted_image,mask,shape = main.encryption(image)
        new_result={
          'encrypted_image':encrypted_image,
          'mask':mask,
          'shape':shape
        }
        return jsonify(new_result)

  
@app.route('/decryption', methods = ['POST', 'GET'])
def decryptiom():
  if request.method == 'POST':
        result = request.get_json()
        print(result)
        image = result['encrypted_image']
        mask=result['mask']
        shape=result['shape']
        decrypted_image = main.decryption(image,mask,shape)
        new_result={
          'decrypted_image':decrypted_image
        }
        return jsonify(new_result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)