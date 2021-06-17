
function saveOptions(e) {

    var gettingItem = browser.storage.local.get('correspondance');
    gettingItem.then((res) => {
      var corres =  res['correspondance']
      if (corres === undefined) {
        corres = [];
      }
      
      var dev_input = document.querySelector("#dev-input")
      var prod_input = document.querySelector("#prod-input")
      
      if(dev_input.value != "" && prod_input.value != "" ) {
        corres.push([dev_input.value, prod_input.value])
      }
      
      return corres;

    }).then((res) => {

      browser.storage.local.set({'correspondance': res}).then(() => {console.log("success store"); restoreOptions();})
                                                          .catch(()=>console.log("error store"));
    })

    e.preventDefault();
  }

function remove(e){

  console.log("tr" , e.target.closest('tr'));

  var  tr =  e.target.closest('tr')

  
  browser.storage.local.get('correspondance').then((res) => {
    corres = res['correspondance'];
    var index_of = -1;
    for (let i = 0; i < corres.length; i++) {
      const element = corres[i];
      console.log(element[0],  element[1],tr.children[0].innerText, tr.children[1].innerText)
      if (element[0] == tr.children[0].innerText && element[1] == tr.children[1].innerText){
        index_of = i;
        break;
      }
    }
    delete corres[index_of];
    return corres;
  }).then((res)=>{
    browser.storage.local.set({'correspondance': res}).then(() => {console.log("success store"); restoreOptions();})
    .catch(()=>console.log("error store"));
  })

}


function restoreOptions() {
  console.log("restore");
  
  var tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  var gettingItem = browser.storage.local.get('correspondance');
  gettingItem.then((res) => {
    for (let i = 0; i < res.correspondance.length; i++) {
      const element = res.correspondance[i];
      dev = element[0];
      prod = element[1];
      
    
      var tr = document.createElement("tr");
      tr.innerHTML = `<td>${dev}</td>
                      <td>${prod}</td>
                      <td><button type="button" class="remove-button"> - </button> </td>`
      tr.querySelector(".remove-button").addEventListener('click', remove);
      tbody.appendChild(tr)
    }
  });

}
  

  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);