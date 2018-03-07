var SortDogs = (obj) => {
  let sorted = []
  for (var i in obj) {
    if (obj[i].hasOwnProperty('kill')) {
      sorted.push(obj[i].kill);
    }
  }
  sorted.sort((a, b) => b - a);
  return sorted;
}

var showRank = (users) => {
  console.log(users);
  let sortedKeys = SortDogs(users);
  console.log(sortedKeys);
  $('#ranks').empty();
  for (let k = 0; k < 10; k++) {
    let key = sortedKeys[k];
    for (let i = 0; i < users.length; i++) {
      if (users[i].kill === key) {
        let kill = `score: ${users[i].kill}`;
        $('#ranks').append(`<li>   ${users[i].name}   :   ${kill} </li>`);
      }
    }
  }
}

showRank();
setInterval(showRank, 1000);
