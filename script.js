const savedTheme=localStorage.getItem('trista-theme')||'light';
const state={lang:localStorage.getItem('trista-lang')||'ru',theme:['light','dark','system'].includes(savedTheme)?savedTheme:'light',style:localStorage.getItem('trista-style')||'Minimal'};

const translations={
ru:{newProject:'Новый проект',preview:'Предпросмотр',beta:'Beta · 0.1 Seed',title:'Создавай сайты визуально',subtitle:'Собирай элементы, соединяй действия в Blueprint и получай готовый сайт без сложного кода.',start:'Начать создавать',demo:'Посмотреть демо',local:'Работает прямо в браузере · без сервера',elements:'Элементы',basic:'Основные',text:'Текст',button:'Кнопка',counter:'Счётчик',container:'Контейнер',logic:'Логика',stylesTitle:'Предустановленные стили',stylesIntro:'Готовые визуальные основы для проекта. Нажми «Использовать» — стиль применится сразу.',minimalDesc:'Чистый и нейтральный',softDesc:'Мягкий и округлый',contrastDesc:'Яркий и выразительный',useStyle:'Использовать',visual:'Визуально',visualDesc:'Добавляй элементы на страницу и настраивай их.',blueprint:'Blueprint',blueprintDesc:'Соединяй события и действия блоками.',styles:'Стили',stylesDesc:'Используй готовые пресеты или свои CSS-стили.',export:'Экспорт',exportDesc:'Получай обычный HTML, CSS и JS.',settings:'Настройки Trista',settingsDesc:'Это настройки самого Trista, а не создаваемого проекта.',close:'Закрыть',appearance:'Тема',language:'Язык',styleChosen:'Стиль применён: ',light:'Светлая',dark:'Тёмная',system:'Системная',russian:'Русский',english:'English',themeHint:'Выбери внешний вид Trista',languageHint:'Выбери язык интерфейса',current:'Текущий'},
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

function makeMenu(id,items){
 const el=document.createElement('div');el.id=id;el.className='quick-menu';el.hidden=true;el.innerHTML=items.map(x=>`<button data-value="${x.value}"><span>${x.icon||''}</span>${x.label}</button>`).join('');document.body.appendChild(el);return el;
}
const langMenu=makeMenu('langMenu',[{value:'ru',icon:'🇷🇺',label:'Русский'},{value:'en',icon:'🇬🇧',label:'English'}]);
const themeMenu=makeMenu('themeMenu',[{value:'light',icon:'☀',label:'Светлая'},{value:'dark',icon:'☾',label:'Тёмная'},{value:'system',icon:'◐',label:'Системная'}]);

function placeMenu(menu,anchor){const r=anchor.getBoundingClientRect();menu.style.top=`${r.bottom+8}px`;menu.style.right=`${Math.max(12,innerWidth-r.right)}px`;menu.hidden=false;requestAnimationFrame(()=>menu.classList.add('open'))}
function closeMenus(){[langMenu,themeMenu].forEach(m=>{m.classList.remove('open');m.hidden=true})}
function updateMenus(){
 langMenu.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.value===state.lang));
 themeMenu.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.value===state.theme));
}

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

function renderSettings(){
 if(!panel)return;
 const title=t().settings,desc=t().settingsDesc;
 panel.innerHTML=`<button class="close" id="closeSettings2" aria-label="${t().close}">×</button><span class="kicker">APP</span><h2>${title}</h2><p>${desc}</p><div class="setting-group"><div class="setting-title">${t().language}</div><small>${t().languageHint}</small><div class="setting-options language-options"><button data-lang="ru">🇷🇺 ${t().russian}<span>✓</span></button><button data-lang="en">🇬🇧 ${t().english}<span>✓</span></button></div></div><div class="setting-group"><div class="setting-title">${t().appearance}</div><small>${t().themeHint}</small><div class="setting-options theme-options"><button data-theme="light">☀ ${t().light}<span>✓</span></button><button data-theme="dark">☾ ${t().dark}<span>✓</span></button><button data-theme="system">◐ ${t().system}<span>✓</span></button></div></div>`;
 panel.querySelector('#closeSettings2').onclick=()=>panel.hidden=true;
 panel.querySelectorAll('[data-lang]').forEach(b=>{b.classList.toggle('active',b.dataset.lang===state.lang);b.onclick=()=>{state.lang=b.dataset.lang;save();render();renderSettings();toast(state.lang==='ru'?'Язык изменён':'Language changed')}});
 panel.querySelectorAll('[data-theme]').forEach(b=>{b.classList.toggle('active',b.dataset.theme===state.theme);b.onclick=()=>{state.theme=b.dataset.theme;save();render();renderSettings();toast(`${t().appearance}: ${t()[state.theme]}`)}});
}

const oldPanelObserver=new MutationObserver(()=>{if(panel&&!panel.hidden)renderSettings()});
oldPanelObserver.observe(panel,{attributes:true,attributeFilter:['hidden']});

document.getElementById('demo')?.addEventListener('click',()=>document.getElementById('stylesSection')?.scrollIntoView({behavior:'smooth',block:'start'}));
document.getElementById('start')?.addEventListener('click',()=>toast(state.lang==='ru'?'Редактор будет следующим шагом Seed.':'The editor is the next Seed step.'));
document.querySelectorAll('[data-style]').forEach(btn=>btn.addEventListener('click',()=>{state.style=btn.dataset.style;save();render();toast(t().styleChosen+state.style)}));

render();