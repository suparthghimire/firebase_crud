let cafeList = document.querySelector("#cafe-list");
let form = document.querySelector("#add-cafe-form");

let update_form = document.querySelector('#update_form')

grabData();
saveData();
function grabData() {
  // not real time
  // db.collection('cafes').get()
  // .then((snapshot)=>{
  //    snapshot.docs.forEach(doc=>{
  //        createList(doc);
  //    })
  // })
  // .catch(e=>{
  //     console.log(e);
  // });

  // real time:
  db.collection("cafes")
    .orderBy("name")
    .onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type === "added") createList(change.doc);
        else if (change.type === "removed") {
          let li = document.querySelector(`[data-id = ${change.doc.id}]`);
          cafeList.removeChild(li);
        }
      });
    });
}

function delete_data(e) {
  let data_id = e.target.parentElement.getAttribute("data-id");

  db.collection("cafes").doc(data_id).delete();
}

function update_data(e){
    let data_id = e.target.parentElement.getAttribute('data-id');
     db.collection('cafes').doc(data_id).update({
         name: update_form.name.value,
         city: update_form.city.value
     });
}

function createList(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");
  let edit = document.createElement('div');
  cross.innerHTML = "x";
  li.setAttribute("data-id", `${doc.id}`);

  name.innerHTML = doc.data().name;
  city.innerHTML = doc.data().city;
  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  cross.addEventListener("click", delete_data);
}

function saveData() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    db.collection("cafes").add({
      name: form.name.value,
      city: form.city.value,
    });
  });
  form.name.value = "";
  form.name.city = "";
}
