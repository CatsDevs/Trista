const detectLanguage=()=>{const list=[...(navigator.languages||[]),navigator.language||'ru'];return list.some(x=>String(x).toLowerCase().startsWith('ru'))?'ru':'en'};
const detectTheme=()=>window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
const savedLang=localStorage.getItem('trista-lang');
const savedTheme=localStorage.getItem('trista-theme');
const state={lang:savedLang||detectLanguage(),theme:['light','dark','system'].includes(savedTheme)?savedTheme:'system',style:localStorage.getItem('trista-style')||'Minimal'};

const translations={
ru:{newProject:'Новый проект',preview:'Предпросмотр',beta:'Beta · 0.1 Seed',title:'Создавай сайты визуально',subtitle:'Собирай элементы, соединяй действия в Blueprint и получай готовый сайт без сложного кода.',start:'Начать создавать',demo:'Посмотреть демо',local:'Работает прямо в браузере · без сервера',elements:'Элементы',basic:'Основные',text:'Текст',button:'Кнопка',counter:'Счётчик',container:'Контейнер',logic:'Логика',stylesTitle:'Предустановленные стили',stylesIntro:'Готовые визуальные основы. Нажми «Использовать» — стиль применится сразу.',minimalDesc:'Чистый и нейтральный',softDesc:'Мягкий и округлый',contrastDesc:'Яркий и выразительный',useStyle:'Использовать',visual:'Визуально',visualDesc:'Добавляй элементы на страницу и настраивай их.',blueprint:'Blueprint',blueprintDesc:'Соединяй события и действия блоками.',styles:'Стили',stylesDesc:'Используй готовые пресеты или свои CSS-стили.',export:'Экспорт',exportDesc:'Получай обычный HTML, CSS и JS.',settings:'Настройки Trista',settingsDesc:'Это настройки самого Trista, а не создаваемого проекта.',close:'Закрыть',appearance:'Тема',language:'Язык',styleChosen:'Стиль применён: ',light:'Светлая',dark:'Тёмная',system:'Системная',russian:'Русский',english:'English',themeHint:'Выбери внешний вид Trista',languageHint:'Выбери язык интерфейса',current:'Текущий'},
en:{newProject:'New project',preview:'Preview',beta:'Beta · 0.1 Seed',title:'Build websites visually',subtitle:'Place elements, connect actions with Blueprint, and get a working website without complicated code.',start:'Start creating',demo:'View demo',local:'Runs right in your browser · no server',elements:'Elements',basic:'Basics',text:'Text',button:'Button',counter:'Counter',container:'Container',logic:'Logic',stylesTitle:'Built-in styles',stylesIntro:'Ready-made visual foundations. Press “Use” and the style applies instantly.',minimalDesc:'Clean and neutral',softDesc:'Soft and rounded',contrastDesc:'Bold and expressive',useStyle:'Use style',visual:'Visual',visualDesc:'Add elements to the page and customize them.',blueprint:'Blueprint',blueprintDesc:'Connect events and actions with blocks.',styles:'Styles',stylesDesc:'Use presets or your own CSS styles.',export:'Export',exportDesc:'Get plain HTML, CSS and JS.',settings:'Trista Settings',settingsDesc:'These settings belong to Trista itself, not to the website project.',close:'Close',appearance:'Theme',language:'Language',styleChosen:'Style applied: ',light:'Light',dark:'Dark',system:'System',russian:'Русский',english:'English',themeHint:'Choose how Trista looks',languageHint:'Choose interface language',current:'Current'}
};

const t=()=>translations[state.lang];
const systemDark=()=>window.matchMedia('(prefers-color-scheme: dark)').matches;
const effectiveDark=()=>state.theme==='dark'||(state.theme==='system'&&systemDark());

function render(){
 document.documentElement.lang=state.lang;
 document.body.classList.toggle('dark',effectiveDark());
 document.body.dataset.theme=state.theme;
 document.body.dataset.siteStyle=state.style.toLowerCase();
 document.querySelectorAll('[data-i18n]').forEach(el=>{const value=t()[el.dataset.i18n];if(value)el.textContent=value});
 const langBtn=document.getElementById('lang');
 const themeBtn=document.getElementById('theme');
 if(langBtn)langBtn.textContent=state.lang==='ru'?'EN':'RU';
 if(themeBtn)themeBtn.textContent=effectiveDark()?'☀':'☾';
 document.querySelectorAll('[data-style]').forEach(btn=>btn.closest('.style')?.classList.toggle('selected',btn.dataset.style===state.style));
 const themeState=document.getElementById('themeState');
 const langState=document.getElementById('langState');
 if(themeState)themeState.textContent=t()[state.theme]||state.theme;
 if(langState)langState.textContent=state.lang.toUpperCase();
 updateMenus();
}

function toast(message){const el=document.getElementById('toast');if(!el)return;el.textContent=message;el.hidden=false;clearTimeout(window.tristaToast);window.tristaToast=setTimeout(()=>el.hidden=true,2400)}
function save(){localStorage.setItem('trista-theme',state.theme);localStorage.setItem('trista-lang',state.lang);localStorage.setItem('trista-style',state.style)}

function makeMenu(id,items){const el=document.createElement('div');el.id=id;el.className='quick-menu';el.hidden=true;el.innerHTML=items.map(x=>`<button data-value="${x.value}"><span>${x.icon||''}</span><b>${x.label}</b></button>`).join('');document.body.appendChild(el);return el}
const langMenu=makeMenu('langMenu',[{value:'ru',icon:'🇷🇺',label:'Русский'},{value:'en',icon:'🇬🇧',label:'English'}]);
const themeMenu=makeMenu('themeMenu',[{value:'light',icon:'☀',label:'Светлая'},{value:'dark',icon:'☾',label:'Тёмная'},{value:'system',icon:'◐',label:'Системная'}]);
function placeMenu(menu,anchor){const r=anchor.getBoundingClientRect();menu.style.top=`${r.bottom+10}px`;menu.style.right=`${Math.max(12,innerWidth-r.right)}px`;menu.hidden=false;requestAnimationFrame(()=>menu.classList.add('open'))}
function closeMenus(){[langMenu,themeMenu].forEach(m=>{m.classList.remove('open');m.hidden=true})}
function updateMenus(){langMenu.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.value===state.lang));themeMenu.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.value===state.theme))}

document.getElementById('theme')?.addEventListener('click',e=>{e.stopPropagation();if(!themeMenu.hidden)closeMenus();else{closeMenus();placeMenu(themeMenu,e.currentTarget)}});
document.getElementById('lang')?.addEventListener('click',e=>{e.stopPropagation();if(!langMenu.hidden)closeMenus();else{closeMenus();placeMenu(langMenu,e.currentTarget)}});
themeMenu.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;state.theme=b.dataset.value;save();closeMenus();render();toast(`${t().appearance}: ${t()[state.theme]}`)});
langMenu.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;state.lang=b.dataset.value;save();closeMenus();render();toast(state.lang==='ru'?'Язык изменён':'Language changed')});
document.addEventListener('click',e=>{if(!e.target.closest('.quick-menu')&&!e.target.closest('#theme')&&!e.target.closest('#lang'))closeMenus()});
window.addEventListener('resize',closeMenus);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(state.theme==='system')render()});

const panel=document.getElementById('panel');
const openSettings=document.getElementById('settings');
const closeSettings=document.getElementById('close');
openSettings?.addEventListener('click',()=>{panel.hidden=false;renderSettings()});
closeSettings?.addEventListener('click',()=>panel.hidden=true);
function renderSettings(){if(!panel)return;const title=t().settings,desc=t().settingsDesc;panel.innerHTML=`<button class="close" id="closeSettings2" aria-label="${t().close}">×</button><span class="kicker">APP</span><h2>${title}</h2><p>${desc}</p><div class="setting-group"><div class="setting-title">${t().language}</div><small>${t().languageHint}</small><div class="setting-options language-options"><button data-lang="ru">🇷🇺 ${t().russian}<span>✓</span></button><button data-lang="en">🇬🇧 ${t().english}<span>✓</span></button></div></div><div class="setting-group"><div class="setting-title">${t().appearance}</div><small>${t().themeHint}</small><div class="setting-options theme-options"><button data-theme="light">☀ ${t().light}<span>✓</span></button><button data-theme="dark">☾ ${t().dark}<span>✓</span></button><button data-theme="system">◐ ${t().system}<span>✓</span></button></div></div>`;panel.querySelector('#closeSettings2').onclick=()=>panel.hidden=true;panel.querySelectorAll('[data-lang]').forEach(b=>{b.classList.toggle('active',b.dataset.lang===state.lang);b.onclick=()=>{state.lang=b.dataset.lang;save();render();renderSettings();toast(state.lang==='ru'?'Язык изменён':'Language changed')}});panel.querySelectorAll('[data-theme]').forEach(b=>{b.classList.toggle('active',b.dataset.theme===state.theme);b.onclick=()=>{state.theme=b.dataset.theme;save();render();renderSettings();toast(`${t().appearance}: ${t()[state.theme]}`)}})}
document.getElementById('demo')?.addEventListener('click',()=>document.getElementById('stylesSection')?.scrollIntoView({behavior:'smooth',block:'start'}));
document.getElementById('start')?.addEventListener('click',()=>toast(state.lang==='ru'?'Редактор будет следующим шагом Seed.':'The editor is the next Seed step.'));
document.querySelectorAll('[data-style]').forEach(btn=>btn.addEventListener('click',()=>{state.style=btn.dataset.style;save();render();toast(t().styleChosen+state.style)}));

/* UI polish: keeps the existing Trista visual language, but makes spacing, controls, cards and mobile layout feel finished. */
const polish=document.createElement('style');polish.textContent=`
:root{--accent:#6758f5;--accent2:#8b7fff}
body{min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background:linear-gradient(120deg,rgba(103,88,245,.035),transparent 35%,rgba(139,127,255,.025))}
.topbar{height:76px;box-shadow:0 1px 0 rgba(20,20,40,.025)}
.brand{font-size:25px}.mark{width:36px;height:36px;border-radius:11px;font-weight:800}
.nav button{transition:background .18s,border-color .18s,transform .18s,box-shadow .18s}.nav button:active{transform:scale(.96)}
.hero{padding-top:86px}.hero h1{max-width:680px}.preview{transition:transform .25s,box-shadow .25s}.preview:hover{transform:rotate(0) translateY(-3px);box-shadow:0 30px 85px rgba(37,31,92,.18)}
.primary,.secondary{transition:transform .18s,box-shadow .18s}.primary:hover{box-shadow:0 16px 36px rgba(102,92,255,.32)}.secondary:hover{transform:translateY(-1px)}
.style{position:relative}.style:after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;box-shadow:inset 0 0 0 0 var(--accent);transition:.2s}.style.selected:after{box-shadow:inset 0 0 0 2px var(--accent)}
.style.selected .info button{background:var(--accent);border-color:var(--accent);color:#fff}.style.selected .info button:after{content:" ✓"}
.info button{transition:.18s}.info button:hover{transform:translateY(-1px)}
.settings{backdrop-filter:blur(22px);background:color-mix(in srgb,var(--surface) 92%,transparent);max-height:calc(100vh - 108px);overflow:auto}
.setting-group{border-top:1px solid var(--border);padding:16px 0}.setting-title{font-weight:800;margin-bottom:4px}.setting-group small{display:block;color:var(--muted);margin-bottom:10px}.setting-options{display:grid;gap:7px}.setting-options button{display:flex;align-items:center;gap:9px;width:100%;padding:11px 12px;border:1px solid var(--border);border-radius:11px;background:var(--surface2);color:var(--text);text-align:left;transition:.18s}.setting-options button span{margin-left:auto;opacity:0;color:var(--accent);font-weight:900}.setting-options button.active{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--surface));color:var(--accent)}.setting-options button.active span{opacity:1}
.quick-menu{position:fixed;min-width:180px;padding:7px;border:1px solid var(--border);border-radius:14px;background:color-mix(in srgb,var(--surface) 94%,transparent);backdrop-filter:blur(22px);box-shadow:0 18px 55px rgba(20,20,50,.16);z-index:100;opacity:0;transform:translateY(-5px) scale(.98);transition:.16s}.quick-menu.open{opacity:1;transform:none}.quick-menu button{display:flex;align-items:center;gap:10px;width:100%;padding:10px 11px;border:0;border-radius:9px;background:transparent;color:var(--text);text-align:left}.quick-menu button:hover{background:var(--surface2)}.quick-menu button.active{background:color-mix(in srgb,var(--accent) 11%,var(--surface));color:var(--accent)}.quick-menu button span{width:20px;text-align:center}.quick-menu button b{font-size:13px}
.toast{backdrop-filter:blur(12px);animation:tristaToast .2s ease-out}@keyframes tristaToast{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}
@media(max-width:600px){.topbar{height:68px;padding:0 13px}.brand{font-size:22px}.mark{width:34px;height:34px}.nav{gap:2px}.nav button{padding:8px 9px}.hero{padding-top:38px}.hero h1{font-size:clamp(42px,12.5vw,60px);margin-top:17px}.hero p{line-height:1.55}.preview{border-radius:18px}.section{padding-bottom:64px}.section h2{font-size:27px}.style{border-radius:17px}.visual{height:135px}.settings{right:12px;top:78px;width:calc(100% - 24px);border-radius:16px}.quick-menu{min-width:170px;max-width:calc(100vw - 24px)}footer{font-size:10px}}
`;
document.head.appendChild(polish);

render();