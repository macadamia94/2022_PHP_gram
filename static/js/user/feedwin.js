if(feedObj) {
  const url = new URL(location.href);
  feedObj.iuser = parseInt(url.searchParams.get('iuser'));
  feedObj.getFeedUrl = '/user/feed';
  feedObj.getFeedList();
}

/*
function getFeedList() {    
  if(!feedObj) { return; }
  feedObj.showLoading();            
  const param = {
    page: feedObj.currentPage++,        
    iuser: url.searchParams.get('iuser')
  }
  fetch('/user/feed' + encodeQueryString(param))
  .then(res => res.json())
  .then(list => {                
    feedObj.makeFeedList(list);                
  })
  .catch(e => {
    console.error(e);
    feedObj.hideLoading();
  });
}
getFeedList();
*/

(function () {
  const url = new URL(location.href);
  const spanCntFollower = document.querySelector('#spanCntFollower');
  const lData = document.querySelector('#lData');
  const btnFollow = document.querySelector('#btnFollow');
  const btnUpdCurrentProfilePic = document.querySelector('#btnUpdCurrentProfilePic');
  const btnDelCurrentProfilePic = document.querySelector('#btnDelCurrentProfilePic');
  const btnProfileImgModalClose = document.querySelector('#btnProfileImgModalClose'); //프로필 수정 눌렀을 때 뜨는 모달 닫기

  if (btnFollow) {
    btnFollow.addEventListener('click', function () {
      const param = {
        toiuser: parseInt(lData.dataset.toiuser)
      };
      console.log(param);
      const follow = btnFollow.dataset.follow;
      console.log('follow : ' + follow);
      const followUrl = '/user/follow';
      switch (follow) {
        case '1': //팔로우 취소
          fetch(followUrl + encodeQueryString(param), { method: 'DELETE' })
            .then((res) => res.json())
            .then((res) => {
              if (res.result) {
                // 팔로워 숫자 변경
                const cntFollowerVal = parseInt(spanCntFollower.innerText);
                spanCntFollower.innerText = cntFollowerVal - 1;

                btnFollow.dataset.follow = '0';
                btnFollow.classList.remove('btn-outline-secondary');
                btnFollow.classList.add('btn-primary');
                if (btnFollow.dataset.youme === '1') {
                  btnFollow.innerText = '맞팔로우 하기';
                } else {
                  btnFollow.innerText = '팔로우';
                }
              }
            });
          break;
        case '0': //팔로우 등록
          fetch(followUrl, {
            method: 'POST',
            body: JSON.stringify(param),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.result) {
                // 팔로워 숫자 변경
                const cntFollowerVal = parseInt(spanCntFollower.innerText);
                spanCntFollower.innerText = cntFollowerVal + 1;

                btnFollow.dataset.follow = '1';
                btnFollow.classList.remove('btn-primary');
                btnFollow.classList.add('btn-outline-secondary');
                btnFollow.innerText = '팔로우 취소';
              }
            });
          break;
      }
    });
  }

  const modalItem = document.createElement('div');
  const gData2 = document.querySelector('#gData').dataset.mainimg;    //head gData에 mainimg 데이터셋 추가 했음
  const btnUpdProfilePic = document.querySelector('#btnUpdProfilePic');   //사진 업로드 id
  
  //위에 만들어졌는데 만약에 이미지 없으면 d-none 주기
  if(gData2 === '') {
      console.log('지금 이미지 없음');
      modalItem.classList.add('d-none');
  }

  //프로필 사진 업로드
  if (btnUpdProfilePic) {
    const changeProfileImg = document.querySelector('#changeProfileImg');
    const frmElem = changeProfileImg.querySelector('form');
    const imgElem = changeProfileImg.querySelector('#currentProfileImg');
    const btnClose = changeProfileImg.querySelector('.btn-close');

    imgElem.addEventListener('click', e => {
      frmElem.imgs.click();
    });

    frmElem.imgs.addEventListener('change', e => {
      if (e.target.files.length > 0) {
        const imgSource = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(imgSource);
        reader.onload = function () {
          imgElem.src = reader.result;
        };

        const changeBtn = changeProfileImg.querySelector('#changeBtn');
        changeBtn.addEventListener('click', e => {
          const files = frmElem.imgs.files[0];
          const fData = new FormData();
          fData.append('imgs[]', files);
          fetch('/user/profile', {
            method: 'POST',
            body: fData
          }).then(res => res.json())
            .then(res => {
              console.log(parseInt(url.searchParams.get('iuser')));
              console.log(res);
              if (res) {
                console.log(res.result);
                const gData = document.querySelector('#gData').dataset.loginiuser;
                const cmtProfileimgList = document.querySelectorAll('#cmtProfileimg');
                cmtProfileimgList.forEach(item => {
                  console.log('gdata:' + gData);
                  console.log('item.iuser:' + item.dataset.iuser);
                  if (parseInt(item.dataset.iuser) !== parseInt(gData)) {
                    console.log(item);
                    item.classList.remove('profileimg');
                  }
                });
                const profileimgList = document.querySelectorAll('.profileimg');
                profileimgList.forEach(item => {
                  item.src = `/static/img/profile/${parseInt(url.searchParams.get('iuser'))}/${res.result}`;
                });
                console.log(res.result);
                btnClose.click();
                //이미지 등록하면 d-none 삭제
                modalItem.classList.remove('d-none');
              }
            });
        });
      }
    });
  }

  if (btnDelCurrentProfilePic) {
    //현재 프로필 사진 삭제
    btnDelCurrentProfilePic.addEventListener('click', e => {
      fetch('/user/profile', {method: 'DELETE'})
      .then(res => res.json())
      .then(res => {
        if(res.result) {
          const profileImgList = document.querySelectorAll('.profileimg');
          profileImgList.forEach(item => {
            item.src = '/static/img/profile/defaultProfileImg_100.png';
          });
        }
        btnProfileImgModalClose.click();
      });
    });
  }

})();

// (function () {
//   const btnFollow = document.querySelector('#btnFollow');
//   btnFollow.addEventListener('click', () => {
//     if (btnFollow.innerText === '팔로우' || btnFollow.innerText === '맞팔로우 하기') {
//       fetch(`http://localhost/user/follow${window.location.search}`, {
//         method: 'POST',
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           btnFollow.setAttribute('data-follow', 1);
//           btnFollow.className = 'btn btn-outline-secondary';
//           btnFollow.innerText = '팔로우 취소';
//         });
//     } else if (btnFollow.innerText === '팔로우 취소') {
//       fetch(`http://localhost/user/follow${window.location.search}`, {
//         method: 'DELETE',
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           btnFollow.setAttribute('data-follow', 0);
//           btnFollow.className = 'btn btn-primary';
//           if (Number(btnFollow.dataset.youme) === 1) {
//             btnFollow.innerText = '맞팔로우 하기';
//           } else {
//             btnFollow.innerText = '팔로우';
//           }
//         });
//     }
//   });
// })();
