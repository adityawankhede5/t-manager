let members = [{name: "Me", isMember: true}];
let today;
let items = [];
const initNewTrans = ()=>{
    // console.log("NEW TRANSACTION INITIALIZED");
    document.getElementById('everything').remove();
    // document.getElementById('newTransBtn').remove();
    // if(document.getElementById('allTransBtn')!==null){
    //     document.getElementById('allTransBtn').remove();
    // }
    
    if(document.getElementById('allTransactions-container')!==null){
        document.getElementById('allTransactions-container').remove();
    }
    today = new Date().toDateString();

    //GET THE PERSON NAMES
    document.getElementById('main-container').insertAdjacentHTML('afterbegin', `<div class="ntinit" id="people"><div class="tdateinfo">${today}</div><form id="addperson-form"><div class="finput"><input type="text" name="person" id="personName" required minlength="4" maxlength="7" autocomplete="off" placeholder="Person name"><button type="submit"><i class="material-icons">person_add</i></button></div></form><form id="newTransaction-form"><input type="text" name="transaction-name" id="transaction-name" required minlength="2" maxlength="20" autocomplete="off" placeholder="Transaction Name"><input type="submit" value="Create"></input></form><div id="members"></div></div>`);
    document.getElementById('members').insertAdjacentHTML('beforeend', `<div class="mdbrief">Members</div><div class="ntmember"><div class="ntmname"><span>Me</span></div></div>`);
    
    // PREVENT ANY DEFAULT FOR FORM SUBMISSIONS
    document.getElementById('addperson-form').addEventListener('submit',(event)=>{
        event.preventDefault();
        appendPerson();
        document.getElementById('addperson-form').reset();
    });
    document.getElementById('newTransaction-form').addEventListener('submit',(event)=>{
        event.preventDefault();
        createTransaction();
    });
}

const appendPerson =()=>{
    const person=document.getElementById("personName");
    const name=person.value;
    members.push({name, isMember: true});
    document.getElementById('members').insertAdjacentHTML('beforeend', `<div class="ntmember" id="ntm-${members.length-1}"><div class="ntmname" id="ntm-${members.length-1}-name"><span>${name}</span></div><div class="ntmtoggle"><span id="person-${members.length-1}-btn" onclick="toggleMember(${members.length-1})"><i class="material-icons" style="color: #e74c3c;">remove_circle</i></span></div></div>`);
    document.getElementById(`ntm-${members.length-1}`).style.animation = 'slideup 0.4s ease';
    // document.getElementById(`ntm-${members.length-1}`).style.opacity = 1;
    // console.log(members);
    person.value="";
}

const toggleMember = (id)=>{
    if(members[id].isMember){
        members[id].isMember=false;
        document.getElementById(`ntm-${id}-name`).style.animation = 'changeopdec 0.4s ease';
        document.getElementById(`ntm-${id}-name`).style.opacity = 0.5;
        document.getElementById(`person-${id}-btn`).innerHTML='<i class="material-icons" style="color: #2ecc71;">add_circle</i>';
    }else{
        members[id].isMember=true;
        document.getElementById(`ntm-${id}-name`).style.animation = 'changeopinc 0.4s ease';
        document.getElementById(`ntm-${id}-name`).style.opacity = 1;
        document.getElementById(`person-${id}-btn`).innerHTML='<i class="material-icons" style="color: #e74c3c;">remove_circle</i>';
    }
}

const createTransaction = ()=>{
    const tname = document.getElementById('transaction-name').value;
    document.getElementById('people').remove();
    let finalMembers = [];
    members.forEach((member)=>{
        if(member.isMember){
            finalMembers.push(member.name);
        }
    });
    // CREATE A TRANSACTION OBJECT
    let transaction = {name: tname, dateCreated: today, members: finalMembers, items};
    // console.log(transaction); 

    // STORE AN EMPTY ARRAY OF TRANSACTION FOR FIRST EVER TRANSACTION IN LOCALSTORAGE
    if(localStorage.length===0){
        localStorage.setItem("allTransactions", "[]");
    }

    //APPEND THE TRANSACTION OBJECT TO LOCALSTORAGE
    let allTransactions = JSON.parse(localStorage.getItem("allTransactions"));
    allTransactions.push(transaction);
    localStorage.setItem("allTransactions", JSON.stringify(allTransactions));
    // console.log(JSON.parse(localStorage.getItem("allTransactions")));
    initItemsList(allTransactions.length-1);
}