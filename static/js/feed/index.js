(function () { // 현재 함수에서만 사용할 수 있는 지역함수
  const btnNewFeedModal = document.querySelector('#btnNewFeedModal');
  if (btnNewFeedModal) { // header.php 13행
    const modal = document.querySelector('#newFeedModal');
    const body = modal.querySelector('#id-modal-body');
    const frmElem = modal.querySelector('form'); // modal안의 form태그
    const btnClose = modal.querySelector('.btn-close');
    
    //이미지 값이 변하면
    frmElem.imgs.addEventListener('change', function (e) {
      // form 태그에서는 id나 name과 같은 자식에게 접근할 때 점(.)으로 접근가능
      if (e.target.files.length > 0) { // input 타입 files의 길이가 0이상인 경우 파일을 선택했음을 의미
        body.innerHTML = `
                    <div>
                        <div class="d-flex flex-md-row">
                            <div class="flex-grow-1 h-full"><img id="id-img" class="w300"></div>
                            <div class="ms-1 w250 d-flex flex-column">                
                                <textarea placeholder="문구 입력..." class="flex-grow-1 p-1"></textarea>
                                <input type="text" placeholder="위치" class="mt-1 p-1">
                            </div>
                        </div>
                    </div>
                    <div class="mt-2">
                        <button type="button" class="btn btn-primary">공유하기</button>
                    </div>
                `;
        const imgElem = body.querySelector('#id-img');  // body에 HTML을 넣고 id를 찾음

        // 컴퓨터에 있는 이미지 뿌리기
        const imgSource = e.target.files[0];  //e.target의 target → form 안에 있는 이미지 ∵거기서 이벤트가 발생했기 때문
        const reader = new FileReader();
        reader.readAsDataURL(imgSource);  // 내 컴퓨터에서의 이미지 위치값
        reader.onload = function () {  // onload : 로딩이 됬을 때 이벤트 발생
          imgElem.src = reader.result;  // 로딩 끝났을 때의 주소값을 src에 넣어줌
        };

        const shareBtnElem = body.querySelector('button');  // 삽입한 body안에서 태그가 버튼인 것을 찾음
        shareBtnElem.addEventListener('click', function() {
          const files = frmElem.imgs.files;

          const fData = new FormData();
          for (let i = 0; i < files.length; i++) {
            fData.append('imgs[]', files[i]);
          }
          fData.append('ctnt', body.querySelector('textarea').value);
          fData.append('location', body.querySelector('input[type=text]').value);

          fetch('/feed/rest', {
            method: 'post',
            body: fData
          }).then(res => res.json())
            .then(myJson => {
              console.log(myJson);
              // const closeBtn = modal.querySelector('.btn-close');
              // closeBtn.click();

              // if (feedObj && myJson.result) {
              //   feedObj.refreshList();
              // }
            });
        });
      }
    });

    btnNewFeedModal.addEventListener('click', function () {
      const selFromComBtn = document.createElement('button');
      selFromComBtn.type = 'button';
      selFromComBtn.className = 'btn btn-primary';
      selFromComBtn.innerText = '컴퓨터에서 선택';
      selFromComBtn.addEventListener('click', function () {
        frmElem.imgs.click(); // frmElem : modal안의 form태그
      }); // 숨겨져 있는 form 태그가 강제로 클릭되도록 이벤트 설정
      body.innerHTML = null;  // body안을 한번 전부 삭제
      body.appendChild(selFromComBtn);
    });
  }
})();