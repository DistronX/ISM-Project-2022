from flask import Flask,render_template,url_for,request,session,logging,redirect,flash
import os


app = Flask(__name__)


@app.route('/encryption', methods = ['POST'])  
def encryption():      
  if request.method == 'POST':          
    global f        
    f = request.files['file']          
    f.save(f.filename)          
    key,image=encrypt(f.filename)        
    return render_template('encryption.html',        
    title='Encrypted',        
    year=datetime.now().year,        
    message='This is your encrypted image', name = f.filename,keys=key,images=image)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)