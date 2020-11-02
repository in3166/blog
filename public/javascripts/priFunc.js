//private
window.onload = function () {
    //메뉴 - 사용자 이메일 리스트

    const guestDeleteConfirm = document.getElementById("guestDeleteConfirm");
    if (guestDeleteConfirm) {
        if (guestDeleteConfirm.value === "true")
            alert("비밀번호를 확인하세요.");
    }

    //게시글 작성 모달 열기
    const priPostBtn = document.getElementById("priPostBtn");
    if (priPostBtn) {
        priPostBtn.addEventListener("click", postModalOpen, false);
    }

    //게시글 등록
    const priPostSubmit = document.getElementById("priPostSubmit");
    if (priPostSubmit) {
        priPostSubmit.addEventListener("click", postSubmit, false);
    }

    //댓글 등록
    const commentSubmitBtn = document.getElementById("commentSubmit");
    if (commentSubmitBtn) {
        commentSubmitBtn.addEventListener("click", commentSubmit, false);
    }

    //댓글 삭제 비밀번호 입력창 열기
    const commentDel = document.getElementsByName("commentDel");
    if (commentDel) {
        for (let i = 0; i < commentDel.length; i++) {
            commentDel[i].addEventListener("click", commentPwModalOpen, false);

        }
    }

    //댓글 삭제
    let commentModalDelBtn = document.getElementById("commentModalDelBtn");
    if (commentModalDelBtn) {
        commentModalDelBtn.addEventListener("click", commentModalDel, false);

    }
}

//댓글 삭제 비밀번호 입력창
function commentPwModalOpen() {
    let value = this.value;
    console.log(value);
    $(document).off('focusin.modal'); //삭제 모달 오픈 시 텍스트 선택 불가 해결 - 모달에 포커스가 있어서
    let commentDelModal = document.getElementById("commentDelModal");
    // let guestModalId = document.getElementById("guestModalId");
    let span = document.getElementById("commentClose");
    //let modal = document.getElementById("modal-window-4");

    //location.href = '#guestDelModal'
    commentDelModal.style.display = "block";
    // guestModalId.value = value;
    document.getElementById("commentModalDelBtn").value = value;

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.addEventListener("click", function () {
            commentDelModal.style.display = "none";
            let input = document.getElementById("commentPw");
            input.value = "";

        }, false);
    }

    // 모달 영역 밖 선택 시 창 닫기
    window.addEventListener("click", function () {
        if (event.target == commentDelModal) {
            commentDelModal.style.display = "none";
            let input = document.getElementById("commentPw");
            input.value = "";
            let fm = document.getElementById("commentDelForm");
            console.log("reset!")
            fm.reset();
            $('#commentPw').removeAttr("disabled");
        }
    }, false);
}

function commentModalDel() {
    let xhr = new XMLHttpRequest();
    let guestPw = document.getElementById("guestPw").value;
    let value = document.getElementById("guestModalDelBtn").value;
    let data = { 'pw': guestPw };
    data = JSON.stringify(data);
    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("삭제 완료!");
            window.location.reload();
        } else if (500) {
            //console.error(xhr.responseText);
            alert("비밀번호를 확인하세요.");
            window.location.reload();
        } else {
            alert("삭제 오류!");
            window.location.reload();
        }
    };
    xhr.open("POST", "/work/delete/" + value);
    xhr.setRequestHeader("Content-Type", "application/json"); // 컨텐츠타입을 json으로
    xhr.send(data);
    console.log(guestPw.value);
}

function postModalOpen() {
    $('body').css("overflow", "hidden");
    let postModal = document.getElementById("postModal");
    // let guestModalId = document.getElementById("guestModalId");
    let span = document.getElementById("postClose");

    // let postModalBtn = document.getElementById("postModalBtn");
    //let modal = document.getElementById("modal-window-4");

    //게시글 작성 모달 오픈
    //location.href = '#guestDelModal'
    postModal.style.display = "block";
    // guestModalId.value = value;

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.addEventListener("click", function () {
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
        }, false);
    }

    // 모달 영역 밖 선택 시 창 닫기
    window.addEventListener("click", function () {
        if (event.target == postModal) {
            postModal.style.display = "none";
            $('body').css("overflow", "scroll");
        }
    }, false);
}

//게시글 전송
function postSubmit() {

    let xhr = new XMLHttpRequest();

    let title = document.getElementById("postTitle").value;
    let content = CKEDITOR.instances.p_content.getData();
    let boardNum = this.value;
    let postPw = document.getElementById("postPw").value;

    let data = { title: title, content: content, pw: postPw };
    data = JSON.stringify(data);
    console.log(data);

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("게시글 작성 완료!");
            window.location.reload();
        } else if (503) {
            //console.error(xhr.responseText);
            alert("비밀번호를 확인하세요.");
            window.location.reload();
        } else {
            alert("게시글 작성 오류!");
            window.location.reload();
        }
    }

    xhr.open('post', '/private/write/' + boardNum);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

//댓글 전송
function commentSubmit() {

    let xhr = new XMLHttpRequest();

    let name = document.getElementById("commentName").value;
    let content = document.getElementById("commentContent").value;
    let pw = document.getElementById("commentPw").value;
    let num = this.value;
    console.log(num);

    let data = { name: name, content: content, pw: pw };
    data = JSON.stringify(data);
    console.log(data);

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            //console.log(xhr.responseText);
            alert("댓글 작성 완료!");
            window.location.reload();
        } else {
            alert("댓글 작성 오류!");
            window.location.reload();
        }
    }

    xhr.open('post', '/private/write/' + num);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

// $("a").click(function () {
//     $(".current").removeClass("current");
//     //return false;
// });

//게시글 작성 버튼들
CKEDITOR.replace('p_content'
    , {
        height: 450
    });
