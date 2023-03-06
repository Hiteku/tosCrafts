function filterCrafts(filter) {
  const attribute = document.querySelector('input[name="attribute"]:checked').value;
  const race = document.querySelector('input[name="race"]:checked').value;
  const set = document.querySelector('option[name="set"]:checked').value;
  // const skill = document.querySelector('input[name="skill"]:checked').value;
  let filteredCrafts = crafts;
  
  if (filter) {
    filteredCrafts = filteredCrafts.filter(craft => craft.attribute === attribute || craft.attribute === "none");
    filteredCrafts = filteredCrafts.filter(craft => craft.race === race || craft.race === "none");
    filteredCrafts = filteredCrafts.filter(craft => craft.set === set || craft.set === "none");
    // filteredCrafts = filteredCrafts.filter(craft => (craft.skill).includes(skill));
  }
  else filteredCrafts = filteredCrafts.filter(craft => craft.attribute === "none" || craft.attribute === "water"
  || craft.attribute === "fire" || craft.attribute === "wood" || craft.attribute === "light" || craft.attribute === "dark");

  const resultTable = document.getElementById('crafts-list');
  resultTable.querySelector('tbody').innerHTML = '';

  filteredCrafts.forEach(craft => {
    // 創建新的表格行，並為其添加表格列。
    const newRow = resultTable.insertRow();
    const numCell = newRow.insertCell();
    const nameCell = newRow.insertCell();
    const attributeCell = newRow.insertCell();
    const raceCell = newRow.insertCell();
    const setCell = newRow.insertCell();
    const acquireCell = newRow.insertCell();
    const abilityTitle = newRow.insertCell();
    const abilityCell = newRow.insertCell();
    const skillCell = newRow.insertCell();
    
    // 設置表格列的內容
    numCell.innerHTML = `<img src="./icon/${craft.num}.png">`;
    nameCell.innerText = craft.name;
    switch (craft.attribute) {
      case 'none': ca = '-'; break;
      case 'water': ca = '水'; break;
      case 'fire': ca = '火'; break;
      case 'wood': ca = '木'; break;
      case 'light': ca = '光'; break;
      case 'dark': ca = '暗'; break;
    }
    attributeCell.innerText = ca;
    switch (craft.race) {
      case 'none': cr = '-'; break;
      case 'god': cr = '神'; break;
      case 'demon': cr = '魔'; break;
      case 'human': cr = '人'; break;
      case 'beast': cr = '獸'; break;
      case 'dragon': cr = '龍'; break;
      case 'fairy': cr = '妖'; break;
      case 'machine': cr = '機'; break;
    }
    raceCell.innerText = cr;
    switch (craft.set) {
      case 'none': cs = '-'; break;
      case 'novaH': cs = 'NOVA-H'; break;
      case 'idol': cs = '偶像發表'; break;
      case 'nordic': cs = '北歐神'; break;
      case 'ancient': cs = '古蹟源龍'; break;
      case 'timeGate': cs = '時空之門'; break;
      case 'grace': cs = '鮮紅恩典'; break;
      case 'witch': cs = '巫女'; break;
      case 'warcraft': cs = '西方魔獸'; break;
      case 'chineseBeasts': cs = '中國神獸'; break;
      case 'ranger': cs = '遊俠'; break;
      case 'egyptian': cs = '埃及神'; break;
      case 'destiny': cs = '命運女神'; break;
      case 'westJourney': cs = '中國神'; break;
      case 'servant': cs = '龍僕'; break;
      case 'protagonist': cs = '主角'; break;
      case 'Molin': cs = '莫靈'; break;
      case 'CangBi': cs = '蒼璧'; break;
      case 'Matthew': cs = '馬休'; break;
    }
    setCell.innerText = cs;
    acquireCell.innerText = craft.acquire;
    abilityCell.innerText = craft.ability;
    abilityTitle.innerText = '血\n攻\n回';
    skillCell.innerText = craft.skill;
    
    // 將新的表格行添加到表格的 tbody 元素中
    resultTable.querySelector('tbody').appendChild(newRow);
  });
}

const filterButton = document.getElementById("filter-button");
filterButton.addEventListener("click", filterCrafts);

const resetButton = document.getElementById("all-button");
resetButton.addEventListener("click", () => {
  /*document.querySelector('option[name="set"][value="none"]').checked = true;
  document.querySelector('input[name="attribute"][value="none"]').checked = true;
  document.querySelector('input[name="race"][value="none"]').checked = true;*/
  filterCrafts(false);
});

// Initialize Crafts list on page load
filterCrafts(false);
