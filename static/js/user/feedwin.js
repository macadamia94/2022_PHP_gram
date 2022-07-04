(function () {
  const gData = document.querySelector('#gData');

  const btnFollow = document.querySelector('#btnFollow');
  if (btnFollow) {
    btnFollow.addEventListener('click', function () {
      const param = {
        toiuser: parseInt(gData.dataset.toiuser)
      };
      console.log(param);
      const follow = btnFollow.dataset.follow;
      console.log('follow : ' + follow);
      const followUrl = '/user/follow';
      switch (follow) {
        case '1': //팔로우 취소   // get, delete 는 보통 쿼리스트링 으로 보냄
          fetch(followUrl + encodeQueryString(param), { method: 'DELETE' }) // encodeQueryString : 쿼리스트링으로 주소값을 보냄
            .then(res => res.json())
            .then(res => {
              if (res.result) {
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
        case '0': //팔로우 등록   // post 는 보통 JSON 방식으로 보냄
          fetch(followUrl, {
            method: 'POST',
            body: JSON.stringify(param) // method 방식이 POST 라서 body에 담음
          })
            .then(res => res.json())
            .then(res => {
              btnFollow.dataset.follow = '1';
              btnFollow.classList.remove('btn-primary');
              btnFollow.classList.add('btn-outline-secondary');
              btnFollow.innerText = '팔로우 취소';
            })
          break;
      }
    });
  }

})();