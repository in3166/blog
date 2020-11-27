const requests = require('request');


url = "https://kauth.kakao.com/oauth/token"

data = {
    "grant_type": "authorization_code",
    "client_id": "ac829dbb7a13a491c1f939af780af3b8",
    "redirect_uri": "http://127.0.0.1:3001/oauth",
    "code": "j1GGTD6QYuEUKzh6xtHulu64_66fZDyt7M8ozmLLLaUc_dAeFh8ba4EhGi5N8wR_m7PLxgorDKcAAAF2CFGfPg"

}
response = requests.post(url, data = data)

tokens = response.json()

console.log(tokens)