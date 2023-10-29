from flask import Flask, render_template
from datetime import datetime


# 可以任意定義名稱 >> app
# 設定伺服器
app = Flask(__name__)
# 將重複出現的函示丟於全域端
books = {1: "Python book", 2: "Java book", 3: "Flask book"}


# 首頁 >> @app.route('/')
@app.route("/")
@app.route("/index")
def index():
    today = datetime.now()
    print(today)
    return render_template("index.html", x=today)
    # 上方套用 flask render_template套件 從 x(前端)套用today到伺服端
    ##return f"<h1>Hello world!123 現在時間{today}</h1>"
    ##print("hello world!") >> 前端用
    ##最後函式的邏輯 >> return


# 原本預設字串 /<!int!:id>" 修飾成數列 !註解部分
@app.route("/books")
def get_all_books():
    books = {
        1: {
            "name": "Python book",
            "price": 299,
            "image_url": "https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/CN1/136/11/CN11361197.jpg&v=58096f9ck&w=348&h=348",
        },
        2: {
            "name": "Java book",
            "price": 399,
            "image_url": "https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/087/31/0010873110.jpg&v=5f7c475bk&w=348&h=348",
        },
        3: {
            "name": "C# book",
            "price": 499,
            "image_url": "https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/036/04/0010360466.jpg&v=62d695bak&w=348&h=348",
        },
    }

    ##books = {1: "Python book", 2: "Java book", 3: "Flask book"}
    for id in books:
        print(id, books[id]["name"], books[id]["price"], books[id]["image_url"])
    # 前方是要渲染的網頁後面是對應的輸出
    return render_template("books.html", books=books)
    ##return books, books[id]


# 邏輯跟變數名稱不可一樣
## ,methods=["GET"]預設函示
@app.route("/books/id=<int:id>", methods=["GET"])
def get_books(id):
    try:
        ##books = {1: "Python book", 2: "Java book", 3: "Flask book"}
        return f"<h2>{books[id]}</h2>"
        ##return books, books[id]
    except Exception as e:
        print(e)
    return "<h1>書籍編號不正確~</h1>"


@app.route("/bmi/name=<name>&height=<h>&weight=<w>", methods=["GET"])
def get_bmi(name, h, w):
    try:
        bmi = round(eval(w) / (eval(h) / 100) ** 2, 2)
        return {"name": name, "height": h, "weight": w, "bmi": bmi}
        ##return f"<h2>{name}</h2> <h2>BMI為:</h2><h3>{(eval(w)/eval(h)**2)*10000}</h3>"
    except Exception as e:
        return str(e)


# 測試程式本地端運行 僅出現一次
if __name__ == "__main__":
    ## debug=True >> 不用每次關閉終端機重起再刷新
    app.run(debug=True)
