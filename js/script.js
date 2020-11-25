// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "",
  authDomain: "programming-q-a.firebaseapp.com",
  databaseURL: "https://programming-q-a.firebaseio.com",
  projectId: "programming-q-a",
  storageBucket: "programming-q-a.appspot.com",
  messagingSenderId: "134240237747",
  appId: "1:134240237747:web:db0c41ca5ca16c42edd8c6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// cloudfirestoreの場面を定義する処理
var db = firebase.firestore().collection('chat06');

// 日時をいい感じの形式にする関数
function convertFromFirestoreTimestampToDatetime(timestamp) {
  const _d = timestamp ? new Date(timestamp * 1000) : new Date();
  const Y = _d.getFullYear();
  const m = (_d.getMonth() + 1).toString().padStart(2, '0');
  const d = _d.getDate().toString().padStart(2, '0');
  const H = _d.getHours().toString().padStart(2, '0');
  const i = _d.getMinutes().toString().padStart(2, '0');
  const s = _d.getSeconds().toString().padStart(2, '0');
  return `${Y}/${m}/${d} ${H}:${i}:${s}`;
}

// 送信ボタンクリックでメッセージ送信
$('#send').on('click', function () {
  // 送信処理の記述
  db.add({
    name: $('#title').val(), // inputの入力値
    text: $('#text').val(), // textareaの入力値
    time: firebase.firestore.FieldValue.serverTimestamp(), // 登録日時
  });
  // 送信後にinput,textareaを空にする処理
  $('#title').val('');
  $('#text').val('');
});

// エンターキーでメッセージ送信
$('#reply').keypress(function (e) {
  if (e.which == 13) {
    // ここに処理を記述
    db.add({
      answer: $('#reply').val()
    });
    $('#reply').val('');
  }
});

// 受信処理の記述
db.orderBy('time', 'desc').onSnapshot(function (querySnapshot) {
  // onSnapshotでcloud firestoreのデータが変更時に実行される！
  // querySnapshot.docsにcloud firestoreのデータが配列型式で入る
  const dataArray = []; //必要なデータだけが入った新しい配列を作成
  querySnapshot.docs.forEach(function (doc) {
    const data = {
      id: doc.id,
      data: doc.data(),
    }
    dataArray.push(data);
  });
  const tagArray = [];
  dataArray.forEach(function (data) {
    const tag = `
    <li id="${data.id}">
    <h4 class="b_title">${data.data.name}</h4>
    <p class="contents">${data.data.text}</p>
    <p class="date">${convertFromFirestoreTimestampToDatetime(data.data.time.second)}</p>      
    </li>
    `;
    tagArray.push(tag);
  });
  $('#output').html(tagArray);
});

// データをリアルタイムに取得する処理
db.orderBy('time', 'desc').onSnapshot(function (querySnapshot) {
  // まずはconsole.log()で出力してデータの形を確認！

});