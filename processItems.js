const initItemsList = (transactionId) => {
    // console.log("INITIALIZING ITEMS LIST");
    document.getElementById('main-container').innerHTML="";
    // console.log(transactionId);
    const currentTransaction=JSON.parse(localStorage.allTransactions)[transactionId];

    document.getElementById('main-container').insertAdjacentHTML('afterbegin', `<div class="aicontainer" id="items"><form id="addItem-form"><div class="nidetails"><div class="nidname"><input type="text" name="item" id="item-name" minlength="3" maxlength="15" autocomplete="off" required placeholder="Item Name"></div><div class="nidamount"><input type="number" name="item-amt" id="item-amt" step="0.01" placeholder="Amount" required></div><div class="nidsplitbtn"><input type="button" onclick="split()" value="Split"></div></div><div id="members-in" class="aiallmembers"></div><div class="aisubmitbtn"><input type="submit" value="Add Item"><input type="button" value="Show Receipt" id="showr-btn" onclick="showReceipt(${transactionId})"></div></form></div>`);

    const membersList = document.getElementById('members-in');
        currentTransaction.members.forEach((member, i)=>{
        membersList.insertAdjacentHTML('beforeend', `<div id="member-${i}" class="aimember"><div class="aimname" onclick="cboxToggle(${i})" id="aim-${i}-container"><span id="member-${i}-name">${member}</span></div><div class="aimamount"><input type="number" name="contri-amt" id="member-${i}-contri" step="0.01" placeholder="Amount"></div><div onclick="cboxToggle(${i})" class="aimcbox"><input type="checkbox" name="isContri" id="member-${i}-checked" checked hidden><i id="aim-${i}-cbox" class="material-icons">check_box</i></div></div>`);
    });
    
    // ADD RADIO BUTTONS FOR PAID BY OPTION.
    membersList.insertAdjacentHTML('beforeend', `<div id="paidby" class="paidby"><div style="padding: 5px;">Paid By:</div></div>`);
    const paidbycontainer = document.getElementById('paidby');
    currentTransaction.members.forEach((member, i)=>{
        paidbycontainer.insertAdjacentHTML('beforeend', `<span id="pbm-${i}" class="pbmember" onclick="paidBy(${i})">${member}<input type="radio" name="pbm-radio" value="${i}" unchecked hidden></input></span>`);
    }); 

    membersList.insertAdjacentHTML('beforeend', `<div id="total"><div class="sdname" id="sdtname"></div><div class="sdamount" id="sdtamount"></div></div><div id="remaining"><div class="sdname" id="sdrname"></div><div class="sdamount" id="sdramount"></div></div>`);
    document.getElementById('items').insertAdjacentHTML('beforeend', '<div id="items-list" class="itemslist"><div id="ilcol-0" class="ilcols"></div><div id="ilcol-1" class="ilcols"></div></div>');
    
    // DISPLAY ITEMS IF THEY EXIST.
    if(currentTransaction.items.length!==0){
        displayItems(currentTransaction);
    }    
    
    // INITIALIZE AT LEAST ONE RADIO BUTTON
    paidBy(0);


    // PREVENT ANY DEFAULTS
    document.getElementById('addItem-form').addEventListener('submit',(event)=>{
        event.preventDefault();
        appendItem(transactionId,currentTransaction);
    });
}

const displayItems = (currentTransaction)=>{

    currentTransaction.items.forEach((item, id)=>{
        if(id%2==0){
            document.getElementById('ilcol-0').insertAdjacentHTML('beforeend', `<div id="item-${id}" class="ilcard"></div>`);    
        }else{
            document.getElementById('ilcol-1').insertAdjacentHTML('beforeend', `<div id="item-${id}" class="ilcard"></div>`);    
        }
        // document.getElementById('items-list').insertAdjacentHTML('beforeend', `<div id="item-${id}"></div>`);

        let currItem = document.getElementById(`item-${id}`);
        currItem.insertAdjacentHTML('beforeend', `<div id="item-${id}-details" class="ilidetails"><span id="item-${id}-name">${item.name}: </span><span id="item-${id}-amount">${item.amount}</span></div>`);
        currItem.insertAdjacentHTML('beforeend', `<div id="item-${id}-members" class="ilmdetails"></div>`);
        const itemMembers = document.getElementById(`item-${id}-members`);
        item.splitInto.forEach((el, i)=>{
            itemMembers.insertAdjacentHTML('beforeend', `<section id="item-${id}-member-${i}" style="padding-left:10px;">${el.name}: ${el.amount}</section>`);
        });
        // console.log(document.getElementById('addItem-form'));
        document.getElementById('addItem-form').reset();
        // console.log(localStorage);
    });


}

const paidBy = (mid) =>{
    const allPaidByMembers = document.querySelectorAll('.pbmember');
    allPaidByMembers.forEach((member, i)=>{
        member.style.background = "white";
        member.style.color = "black";
    });    
    allPaidByMembers[mid].children[0].checked = true;
    allPaidByMembers[mid].style.background = "#34495e";
    allPaidByMembers[mid].style.color = "white";
}

const cboxToggle = (mid) => {
    if(document.getElementById(`member-${mid}-checked`).checked){
        // console.log('checked');
        document.getElementById(`member-${mid}-checked`).checked = false;
        document.getElementById(`aim-${mid}-cbox`).innerText = `check_box_outline_blank`;
        document.getElementById(`aim-${mid}-container`).style.opacity = 0.5;
    }else{
        document.getElementById(`member-${mid}-checked`).checked = true;
        document.getElementById(`aim-${mid}-cbox`).innerText = `check_box`;
        document.getElementById(`aim-${mid}-container`).style.opacity = 1;
    }
    // document.getElementById(`member-${mid}-checked`)
}

const split =()=>{
    const checkeditemscount=document.querySelectorAll('input[type="checkbox"]:checked').length;
    const amt = parseFloat(document.getElementById('item-amt').value).toFixed(2);
    const splitamt = (amt/checkeditemscount).toFixed(2);
    const membersIn = document.querySelectorAll('#members-in .aimember');
    for(let i=0;i<membersIn.length;i++){
        if(membersIn[i].children[2].children[0].checked){
            membersIn[i].children[1].children[0].value = splitamt;
        }else{
            membersIn[i].children[1].children[0].value = null;
        }
    }
}



const appendItem = (transactionId, currentTransaction) => {
    // let item = {name: itemname, amount: amt, paidby: pbm-id ,splitInto: [{name, amount}]};
    if(document.getElementById('items-list')!==null){
        document.getElementById('items-list').style.display = 'flex';
    }
    if(document.getElementById(`t-${transactionId}`)!== null){
        document.getElementById(`t-${transactionId}`).remove();
    }
    const name = document.getElementById('item-name').value;
    const amount = parseFloat(document.getElementById('item-amt').value);
    const members = document.querySelectorAll('#members-in .aimember');
    let splitInto = [];
    let uncheckedMembers = [];
    let mname, mamount,totalAmount=0;
    for(let i=0;i<members.length;i++){
        if(members[i].children[2].children[0].checked){
            mname=members[i].children[0].innerText;
            if(members[i].children[1].children[0].value===null  || members[i].children[1].children[0].value===""){
                totalAmount+=mamount=0.0;
            }else{
                totalAmount+=mamount=parseFloat(members[i].children[1].children[0].value);
            }
            
            splitInto.push({id: i,name: mname, amount: mamount});
        }else{
            uncheckedMembers.push(i);
        }
    }
    document.getElementById('sdtname').innerText = 'Total';
    document.getElementById('sdtamount').innerText = totalAmount.toFixed(2);
    document.getElementById('sdrname').innerText = 'Remaining';
    document.getElementById('sdramount').innerText = (amount-totalAmount).toFixed(2);
    // document.getElementById('total').innerText = `Total: ${totalAmount.toFixed(2)}`;
    // document.getElementById('remaining').innerText = `Remainig: ${(amount-totalAmount).toFixed(2)}`;
    
    // console.log(totalAmount);
    if(totalAmount<(amount-1) || totalAmount>(amount+1)){
        // console.log("TOTAL CONTRIBUTION NOT EQUAL TO TOTAL AMOUNT");
        document.getElementById('remaining').style.border = '';
        document.getElementById('remaining').style.border = '1px solid #cd6155';
        return;
    }
    
    const paidby = parseInt(document.querySelector('input[name="pbm-radio"]:checked').value);
    document.getElementById('remaining').style.border = '';
    item = {name, amount, paidby, splitInto};
    currentTransaction.items.push(item);
    const itemId = currentTransaction.items.length-1;     
    let allTransactions = JSON.parse(localStorage.getItem("allTransactions"));
    allTransactions[transactionId] = currentTransaction;
    localStorage.setItem("allTransactions", JSON.stringify(allTransactions));
    
    // document.getElementById('items').insertAdjacentHTML('beforeend', '<div id="items-list"></div>');
    if(itemId%2==0){
        document.getElementById('ilcol-0').insertAdjacentHTML('beforeend', `<div id="item-${itemId}" class="ilcard"></div>`);    
    }else{
        document.getElementById('ilcol-1').insertAdjacentHTML('beforeend', `<div id="item-${itemId}" class="ilcard"></div>`);    
    }
    // document.getElementById('items-list').insertAdjacentHTML('beforeend', `<div id="item-${itemId}"></div>`);
    
    let currItem = document.getElementById(`item-${itemId}`);
    currItem.insertAdjacentHTML('beforeend', `<div id="item-${itemId}-details" class="ilidetails"><span id="item-${itemId}-name">${item.name}: </span><span id="item-${itemId}-amount">${item.amount}</span></div>`);
    currItem.insertAdjacentHTML('beforeend', `<div id="item-${itemId}-members" class="ilmdetails"></div>`);
    const itemMembers = document.getElementById(`item-${itemId}-members`);
    item.splitInto.forEach((el, i)=>{
        itemMembers.insertAdjacentHTML('beforeend', `<section id="item-${itemId}-member-${i}" style="padding-left:10px;">${el.name}: ${el.amount}</section>`);
    });
    // console.log(document.getElementById('addItem-form'));
    document.getElementById('addItem-form').reset();
    uncheckedMembers.forEach((mid)=>{
        members[mid].children[2].children[0].checked=false;
    });
    document.querySelectorAll('input[name="pbm-radio"]')[paidby].checked = true;
    // console.log(localStorage);   
}

const showReceipt = (tid) => {
    if(document.getElementById('items-list')!==null){
        document.getElementById('items-list').style.display = 'none';
    }
    if(document.getElementById(`t-${tid}`)!== null){
        document.getElementById(`t-${tid}`).remove();
        return;
        // document.getElementById(`tend-btn`).remove();
    }
    const t = JSON.parse(localStorage.allTransactions)[tid];
    document.getElementById('addItem-form').insertAdjacentHTML('beforeend', `<div id="t-${tid}"><div id="t-${tid}-breif"><span class="tnameinfo">${t.name}</span><span class="tdateinfo"> on ${t.dateCreated}</span></div></div>`);
    getTransaction(tid);
    document.getElementById(`t-${tid}`).insertAdjacentHTML('beforeend', '<div class="tendbtn"><button id="tend-btn" onclick="endTransaction()">End Transaction</button></div>');
}

const endTransaction=()=>{
    document.location.reload();
}

