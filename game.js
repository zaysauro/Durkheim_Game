const cards=[
 {emoji:"↕",title:"Via de mão dupla",text:"Indica que a via permite circulação nos dois sentidos. Observe a sinalização e a marcação da pista antes de escolher o caminho.",jp:"対面通行"},
 {emoji:"→",title:"Sentido obrigatório",text:"Indica a direção em que o veículo deve seguir naquele ponto da via.",jp:"指定方向外進行禁止"},
 {emoji:"⛔",title:"Entrada proibida",text:"Impede a entrada de veículos por aquela direção. É uma restrição de acesso, não apenas um aviso.",jp:"車両進入禁止"},
 {emoji:"🚫",title:"Via fechada",text:"Indica que a passagem de veículos está proibida naquele trecho da via.",jp:"通行止め"},
 {emoji:"△",title:"Dê a preferência",text:"O condutor deve reduzir e dar prioridade ao tráfego da via preferencial.",jp:"徐行 / 優先道路"},
 {emoji:"50",title:"Limite de velocidade",text:"Indica a velocidade máxima permitida no trecho sinalizado.",jp:"最高速度"},
 {emoji:"P",title:"Estacionamento proibido",text:"A sinalização restringe o estacionamento no trecho indicado.",jp:"駐車禁止"},
 {emoji:"🚶",title:"Área de pedestres",text:"Indica uma área em que a circulação de veículos é restringida para priorizar pedestres.",jp:"歩行者専用"},
 {emoji:"↰",title:"Direção específica",text:"A seta sinaliza a direção autorizada ou obrigatória naquele ponto.",jp:"指定方向"},
 {emoji:"40",title:"Velocidade máxima",text:"Neste exemplo, o número indica que a velocidade máxima é de 40 km/h.",jp:"最高速度 40"}
];

let idx=0,flipped=false,memoryItems=[],memoryIndex=0,memoryScore=0,driveGood=0,driveBad=0;
const $=id=>document.getElementById(id);
function show(id,stage,pct){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");$("stageLabel").textContent=stage;$("globalProgress").style.width=pct+"%";window.scrollTo({top:0,behavior:"smooth"})}
function startFlashcards(){idx=0;flipped=false;$("cardTotal").textContent=cards.length;renderCard();show("flashcards","Flashcards",10)}
function signHTML(c){return `<span>${c.emoji}</span>`}
function renderCard(){const c=cards[idx];$("signFront").innerHTML=signHTML(c);$("signBack").innerHTML=signHTML(c);$("answerTitle").textContent=c.title;$("answerText").textContent=c.text;$("answerJP").textContent=c.jp;$("cardNum").textContent=idx+1;$("flashcard").classList.remove("flipped");flipped=false;$("nextCard").disabled=true}
function flipCard(){if(flipped)return;flipped=true;$("flashcard").classList.add("flipped");$("nextCard").disabled=false}
function nextCard(){if(!flipped)return;if(idx<cards.length-1){idx++;renderCard()}else{prepareMemory()}}
function prepareMemory(){memoryItems=[...cards].sort(()=>Math.random()-.5).slice(0,5);memoryIndex=0;memoryScore=0;renderQuiz();show("memory","Teste de memória",40)}
function renderQuiz(){const c=memoryItems[memoryIndex];$("memoryNum").textContent=memoryIndex+1;$("quizSign").innerHTML=signHTML(c);let choices=[c.title,...cards.filter(x=>x!==c).sort(()=>Math.random()-.5).slice(0,2).map(x=>x.title)].sort(()=>Math.random()-.5);$("quizOptions").innerHTML=choices.map(x=>`<button class="option" onclick="answerQuiz(this,${JSON.stringify(x===c.title)})">${x}</button>`).join("");$("quizFeedback").textContent=""}
function answerQuiz(btn,correct){document.querySelectorAll(".option").forEach(b=>b.disabled=true);if(correct){btn.classList.add("correct");memoryScore++;$("quizFeedback").textContent="✓ Correto. Você recuperou a regra aprendida."}else{btn.classList.add("wrong");$("quizFeedback").textContent="✕ Não foi dessa vez. A resposta correta era: "+memoryItems[memoryIndex].title}setTimeout(()=>{memoryIndex++;if(memoryIndex<memoryItems.length)renderQuiz();else startDrive()},850)}
function startDrive(){driveGood=0;driveBad=0;$("driveGood").textContent=0;$("driveBad").textContent=0;initGame();show("drive","Minigame",70)}

let ctx,canvas,keys={},car,gameOver=false,last=0,roads=[],signs=[],target;
function initGame(){
 canvas=$("game");ctx=canvas.getContext("2d");car={x:95,y:470,r:13,speed:0};gameOver=false;
 roads=[{x:0,y:420,w:900,h:80},{x:170,y:0,w:80,h:560},{x:500,y:0,w:80,h:560},{x:750,y:0,w:80,h:560},{x:0,y:145,w:900,h:65}];
 signs=[
  {x:210,y:385,emoji:"→",correct:"right",msg:"A placa indica a direção permitida."},
  {x:540,y:385,emoji:"⛔",correct:"left",msg:"Entrada proibida: siga pela alternativa."},
  {x:790,y:385,emoji:"△",correct:"up",msg:"Dê a preferência e siga pela via indicada."}
 ];
 target={x:790,y:75};
 requestAnimationFrame(loop);
}
function drawMap(){ctx.clearRect(0,0,900,560);ctx.fillStyle="#a8bda2";ctx.fillRect(0,0,900,560);roads.forEach(r=>{ctx.fillStyle="#49545a";ctx.fillRect(r.x,r.y,r.w,r.h);ctx.strokeStyle="#d4c87a";ctx.lineWidth=2;ctx.setLineDash([14,14]);if(r.w>r.h){ctx.beginPath();ctx.moveTo(r.x,r.y+r.h/2);ctx.lineTo(r.x+r.w,r.y+r.h/2);ctx.stroke()}else{ctx.beginPath();ctx.moveTo(r.x+r.w/2,r.y);ctx.lineTo(r.x+r.w/2,r.y+r.h);ctx.stroke()}ctx.setLineDash([])});ctx.fillStyle="#dce6d6";ctx.font="bold 16px system-ui";ctx.fillText("✈️ AEROPORTO",35,465);ctx.fillText("🏪",335,462);ctx.fillText("🏠",620,462);ctx.fillText("💊 FARMÁCIA",680,52);ctx.fillText("🗻",410,120);signs.forEach(s=>{ctx.fillStyle="#fff";ctx.fillRect(s.x-19,s.y-19,38,38);ctx.strokeStyle="#111";ctx.strokeRect(s.x-19,s.y-19,38,38);ctx.fillStyle="#111";ctx.font="bold 21px system-ui";ctx.textAlign="center";ctx.fillText(s.emoji,s.x,s.y+7);ctx.textAlign="left"});ctx.fillStyle="#52c78b";ctx.beginPath();ctx.arc(target.x,target.y,20,0,Math.PI*2);ctx.fill();ctx.fillStyle="#092";ctx.font="bold 12px system-ui";ctx.fillText("META",target.x-17,target.y+4)}
function loop(t){if(gameOver)return;let dt=Math.min((t-last)/16,2);last=t;update(dt);drawMap();drawCar();if(Math.hypot(car.x-target.x,car.y-target.y)<35){finishDrive()}else requestAnimationFrame(loop)}
function update(dt){let dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0);let dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);let mag=Math.hypot(dx,dy)||1;car.x+=dx/mag*2.5*dt;car.y+=dy/mag*2.5*dt;car.x=Math.max(12,Math.min(888,car.x));car.y=Math.max(12,Math.min(548,car.y));if(Math.hypot(car.x-210,car.y-385)<28){if(!car.p1){car.p1=true;driveGood++;$("driveGood").textContent=driveGood;msg("✓ Você identificou a sinalização e continuou.")}}if(Math.hypot(car.x-540,car.y-385)<28){if(!car.p2){car.p2=true;driveBad++;$("driveBad").textContent=driveBad;msg("⚠️ Entrada proibida. Você precisou corrigir a rota.")}}if(Math.hypot(car.x-790,car.y-385)<28){if(!car.p3){car.p3=true;driveGood++;$("driveGood").textContent=driveGood;msg("✓ Boa leitura da placa.")}}}
function drawCar(){ctx.save();ctx.translate(car.x,car.y);ctx.fillStyle="#e85d5d";ctx.fillRect(-11,-16,22,32);ctx.fillStyle="#cfe4ed";ctx.fillRect(-7,-11,14,9);ctx.fillStyle="#171b20";ctx.fillRect(-14,-11,4,8);ctx.fillRect(10,-11,4,8);ctx.fillRect(-14,4,4,8);ctx.fillRect(10,4,4,8);ctx.restore()}
function msg(t){$("driveMessage").textContent=t;setTimeout(()=>{$("driveMessage").textContent=""},1800)}
function finishDrive(){gameOver=true;$("finalMemory").textContent=`${memoryScore}/${memoryItems.length}`;$("finalDrive").textContent=driveGood;$("finalErrors").textContent=driveBad;show("result","Resultado",100)}
window.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();keys[e.key]=true});
window.addEventListener("keyup",e=>keys[e.key]=false);
document.querySelectorAll(".touch-controls button").forEach(b=>{const k=b.dataset.key;b.addEventListener("pointerdown",()=>keys[k]=true);["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false))});
