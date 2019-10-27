const getAllTransactions = ()=>{
    //CLEAR THE PREVIOUS OUTPUT.
    if(document.getElementById('allTransactions-container')!==null){
        document.getElementById('allTransactions-container').remove();
    }

    const allTransactions = JSON.parse(localStorage.allTransactions);
    if(allTransactions.length===0){
        if(document.getElementById('allTransactions-container')!==null){
            document.getElementById('allTransactions-container').remove();
        }
        document.getElementById('shcontainer-read').insertAdjacentHTML('beforeend', '<div id="allTransactions-container">No Transactions yet.</div>');
    }else{
        document.getElementById('shcontainer-read').insertAdjacentHTML('beforeend', '<div id="allTransactions-container"></div>');
    }
    
    const allTransContainer = document.getElementById('allTransactions-container');
    allTransactions.forEach((t, tid)=>{
        // console.log(`Name: ${t.name}, Date: ${t.dateCreated}`);
        allTransContainer.insertAdjacentHTML('beforeend', `<div class="t" id="t-${tid}"><span class="icon-span" style="float: right;background-color: #e74c3c;" onclick="deleteTransaction(${tid})"><i class="material-icons">delete</i></span><span class="icon-span" style="float: right;background-color: #2ecc71;" onclick="editTransaction(${tid})"><i class="material-icons">edit</i></span><span class="icon-span" style="float: right;background-color: #17c0eb;" onclick="getTransaction(${tid})"><i id="showhide-${tid}" class="material-icons">keyboard_arrow_down</i></span><div id="t-${tid}-breif"><span class="tnameinfo">${t.name}</span><br><span class="tdateinfo">on ${t.dateCreated}</span></div><div class="allMnames" id="t-${tid}-mnames"></div></div>`);
        const transcT = document.getElementById(`t-${tid}-mnames`);
        t.members.forEach((m)=>{
            // console.log(`\t${m}`);
            transcT.insertAdjacentHTML('beforeend', `<span class="tmnames">${m}</span>`);
        });
    });
}

const getTransaction = (tid, receipt) => {
    const transcT = JSON.parse(localStorage.allTransactions)[tid];
    // console.log(transcT);
    receipt = generateReceipt(transcT);
    // console.log(receipt);
    displayReceipt(receipt, tid);
}

const generateReceipt = (transcT)=>{
    let receipt = new Array(transcT.members.length);
    for(i=0;i<receipt.length;i++){
        receipt[i] = {name: transcT.members[i], contri: new Array()};
    }
    
    transcT.items.forEach((item)=>{
        itemname = item.name;
        item.splitInto.forEach((member)=>{
            receipt[parseInt(member.id)].contri.push({name: itemname, amount: member.amount});
        });
    });

    return receipt;
}

const displayReceipt = (receipt, tid) => {
    if(document.getElementById(`receipt-${tid}-details`)!== null){
        document.getElementById(`receipt-${tid}-details`).remove();
        document.getElementById(`t-${tid}-mnames`).style.display = 'flex';
        document.getElementById(`showhide-${tid}`).innerText='keyboard_arrow_down';
        return;
    }
    
    if(document.getElementById(`t-${tid}-mnames`)!==null){
        document.getElementById(`t-${tid}-mnames`).style.display = 'none';
        document.getElementById(`showhide-${tid}`).innerText='keyboard_arrow_up';
    }

    document.getElementById(`t-${tid}`).insertAdjacentHTML('beforeend', `<div class="rdetails" id="receipt-${tid}-details"><div class="rdcols" id="receipt-${tid}-col-1"></div><div class="rdcols" id="receipt-${tid}-col-2"></div></div>`);
    const rdcol1 = document.getElementById(`receipt-${tid}-col-1`);
    const rdcol2 = document.getElementById(`receipt-${tid}-col-2`);
    receipt.forEach((member, i)=>{
        if((i%2)===0){
            rdcol1.insertAdjacentHTML('beforeend', `<div class="rmcard" id="receipt-${tid}-rmember-${i}"><div class="rmdetails" id="rmember-${i}-name">${member.name}</div></div>`);
        }else{
            rdcol2.insertAdjacentHTML('beforeend', `<div class="rmcard" id="receipt-${tid}-rmember-${i}"><div class="rmdetails" id="rmember-${i}-name">${member.name}</div></div>`);
        }
        // rdetailsContainer.insertAdjacentHTML('beforeend', `<div class="rmcard" id="receipt-${tid}-rmember-${i}"><div class="rmdetails" id="rmember-${i}-name">${member.name}</div></div>`);
        let rmContainer = document.getElementById(`receipt-${tid}-rmember-${i}`);
        mtotal=0.0;
        member.contri.forEach((item, it)=>{
            rmContainer.insertAdjacentHTML('beforeend', `<div class="ridetails" id="rm-${i}-details"><span id="item-${it}-name">${item.name}: </span><span id="item-${it}-amount">${item.amount}</span></div>`);
            mtotal+=item.amount;
            // console.log(item.amount);
        });
        mtotal = mtotal.toFixed(2);
        document.getElementById(`rmember-${i}-name`).innerText += `: ${mtotal}`;
    });
    document.getElementById(`receipt-${tid}-details`).style.animation = 'slideup 0.4s ease';
}

const editTransaction = (tid) => {
    initItemsList(tid);
}

const deleteTransaction = (tid) => {
    const allTransactions = JSON.parse(localStorage.allTransactions);
    let allTransactionsNew = allTransactions;
    if(tid!==allTransactions.length){
        for(i=tid+1;i<allTransactions.length;i++){
            allTransactionsNew[i-1]=allTransactions[i];
        }
    }
    allTransactionsNew.pop();
    localStorage.allTransactions = JSON.stringify(allTransactionsNew);
    document.location.reload();
}