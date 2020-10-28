//private
window.onload = function () {
    //메뉴 - 사용자 이메일 리스트

    const guestDeleteConfirm = document.getElementById("guestDeleteConfirm");
    if (guestDeleteConfirm) {
        if (guestDeleteConfirm.value === "true")
            alert("비밀번호를 확인하세요.");
    }

    const postbtn = document.getElementById("postbtn");
    if (postbtn) {
        postbtn.addEventListener("click", postModalOpen(), false);
    }

    const postModBtn = document.getElementById("postModBtn");
    if (postModBtn) {
        postModBtn.addEventListener("click", postModalOpen(), false);
    }


}

function postModalOpen() {

    let postModal = document.getElementById("postModal");
    // let guestModalId = document.getElementById("guestModalId");
    let span = document.getElementById("postClose");
    let postModalBtn = document.getElementById("postModalBtn");
    //let modal = document.getElementById("modal-window-4");

    //게시글 작성 모달 오픈
    //location.href = '#guestDelModal'
    postModal.style.display = "block";
    // guestModalId.value = value;

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.addEventListener("click", function () {
            postModal.style.display = "none";
        }, false);
    }

    //게시글 작성 버튼 클릭
    if (postModalBtn) {
        postModalBtn.addEventListener("click", function () {
            let xhr = new XMLHttpRequest();
            let title = document.getElementById("postTitle").value;
            let content = document.getElementById("postContent").value;
            let boardNum = document.getElementById("boardNum").value;

            let postPw = document.getElementById("postPw").value;
            let data = { 'title': title, 'content': content, 'boardNum': boardNum, 'postPw': postPw };
            data = JSON.stringify(data);
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 201) {
                    //console.log(xhr.responseText);
                    alert("게시글 작성 완료!");
                    window.location.reload();
                } else if (500) {
                    //console.error(xhr.responseText);
                    alert("비밀번호를 확인하세요.");
                    // window.location.reload();
                } else {
                    alert("게시글 작성 오류!");
                    // window.location.reload();
                }
            };
            xhr.open("POST", "/private/write/" + boardNum);
            xhr.setRequestHeader("Content-Type", "application/json"); // 컨텐츠타입을 json으로
            //
            xhr.send(data);

            // let fm = document.getElementById("guestDelForm");
            // let guestPw = document.getElementById("guestPw");
            //console.log(guestPw.value);
            // fm.method = "POST";
            // fm.target = "_self";
            // fm.action = "/work/delete/" + value;
            // fm.submit();
        }, false);
    }
    // 모달 영역 밖 선택 시 창 닫기
    window.addEventListener("click", function () {
        if (event.target == postModal) {
            postModal.style.display = "none";
        }
    }, false);
}