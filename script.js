const uiStyle=document.createElement('style');uiStyle.textContent=`
.quick-menu{position:fixed;min-width:170px;padding:7px;background:var(--surface);border:1px solid var(--border);border-radius:14px;box-shadow:0 18px 50px rgba(20,20,40,.18);z-index:100;opacity:0;transform:translateY(-5px) scale(.98);transition:.16s ease;backdrop-filter:blur(18px)}
.quick-menu.open{opacity:1;transform:none}.quick-menu button{width:100%;display:flex;align-items:center;gap:10px;padding:10px 11px;border:0;border-radius:9px;background:transparent;color:var(--text);text-align:left;font-size:13px}.quick-menu button:hover{background:var(--soft)}.quick-menu button.active{background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);font-weight:750}.quick-menu button span{width:22px;text-align:center}
.settings{max-height:calc(100vh - 110px);overflow:auto}.setting-group{border-top:1px solid var(--border);padding:18px 0 2px}.setting-title{font-weight:750;font-size:14px;margin-bottom:3px}.setting-group small{display:block;color:var(--muted);font-size:11px;margin-bottom:10px}.setting-options{display:grid;gap:7px}.setting-options button{display:flex;align-items:center;justify-content:space-between;width:100%;padding:11px 12px;border:1px solid var(--border);border-radius:11px;background:var(--soft);color:var(--text);font-size:13px}.setting-options button span{opacity:0;color:var(--accent);font-weight:900}.setting-options button.active{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--surface));box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 12%,transparent)}.setting-options button.active span{opacity:1}
.style{position:relative}.style.selected{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 18%,transparent),0 18px 45px rgba(30,30,60,.10)}.style.selected:after{content:'✓';position:absolute;right:12px;top:12px;width:27px;height:27px;display:grid;place-items:center;border-radius:50%;background:var(--accent);color:#fff;font-size:14px;font-weight:900;box-shadow:0 6px 16px rgba(104,92,255,.25)}.style .info button{transition:.16s}.style .info button:hover{background:var(--accent);border-color:var(--accent);color:#fff}.style.selected .info button{background:var(--accent);border-color:var(--accent);color:#fff}
body[data-site-style="soft"]{--accent:#806fff;--accent2:#a79dff}.soft .visual{box-shadow:inset 0 0 0 1px rgba(128,111,255,.08)}body[data-site-style="contrast"]{--accent:#536dff;--accent2:#7c91ff;--bg:#f4f5f8;--soft:#e8eaf0;--text:#11131a}body.dark[data-site-style="contrast"]{--bg:#080a0f;--surface:#11141b;--soft:#191d26;--text:#f7f8fb;--border:#303642;--accent:#7790ff}.contrast .visual{box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
@media(max-width:620px){.quick-menu{min-width:155px}.settings{right:10px;top:76px;width:calc(100% - 20px);padding:18px;border-radius:16px}.style.selected:after{right:10px;top:10px}}
`;document.head.appendChild(uiStyle);

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

function makeMenu(id,items){const el=document.createElement('div');el.id=id;el.className='quick-menu';el.hidden=true;el.innerHTML=items.map(x=>`<button data-value="${x.value}"><span>${x.icon||''}</span>${x.label}</button>`).join('');document.body.appendChild(el);return el}
const langMenu=makeMenu('langMenu',[{value:'ru',icon:'🇷🇺',label:'Русский'},{value:'en',icon:'🇬🇧',label:'English'}]);
const themeMenu=makeMenu('themeMenu',[{value:'light',icon:'☀',label:'Светлая'},{value:'dark',icon:'☾',label:'Тёмная'},{value:'system',icon:'◐',label:'Системная'}]);
function placeMenu(menu,anchor){const r=anchor.getBoundingClientRect();menu.style.top=`${r.bottom+8}px`;menu.style.right=`${Math.max(12,innerWidth-r.right)}px`;menu.hidden=false;requestAnimationFrame(()=>menu.classList.add('open'))}
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
function renderSettings(){
 if(!panel)return;
 panel.innerHTML=`<button class="close" id="closeSettings2" aria-label="${t().close}">×</button><span class="kicker">APP</span><h2>${t().settings}</h2><p>${t().settingsDesc}</p><div class="setting-group"><div class="setting-title">${t().language}</div><small>${t().languageHint}</small><div class="setting-options language-options"><button data-lang="ru">🇷🇺 ${t().russian}<span>✓</span></button><button data-lang="en">🇬🇧 ${t().english}<span>✓</span></button></div></div><div class="setting-group"><div class="setting-title">${t().appearance}</div><small>${t().themeHint}</small><div class="setting-options theme-options"><button data-theme="light">☀ ${t().light}<span>✓</span></button><button data-theme="dark">☾ ${t().dark}<span>✓</span></button><button data-theme="system">◐ ${t().system}<span>✓</span></button></div></div>`;
 panel.querySelector('#closeSettings2').onclick=()=>panel.hidden=true;
 panel.querySelectorAll('[data-lang]').forEach(b=>{b.classList.toggle('active',b.dataset.lang===state.lang);b.onclick=()=>{state.lang=b.dataset.lang;save();render();renderSettings();toast(state.lang==='ru'?'Язык изменён':'Language changed')}});
 panel.querySelectorAll('[data-theme]').forEach(b=>{b.classList.toggle('active',b.dataset.theme===state.theme);b.onclick=()=>{state.theme=b.dataset.theme;save();render();renderSettings();toast(`${t().appearance}: ${t()[state.theme]}`)}});
}
const oldPanelObserver=new MutationObserver(()=>{if(panel&&!panel.hidden)renderSettings()});oldPanelObserver.observe(panel,{attributes:true,attributeFilter:['hidden']});

document.getElementById('demo')?.addEventListener('click',()=>document.getElementById('stylesSection')?.scrollIntoView({behavior:'smooth',block:'start'}));
document.getElementById('start')?.addEventListener('click',()=>toast(state.lang==='ru'?'Редактор будет следующим шагом Seed.':'The editor is the next Seed step.'));
document.querySelectorAll('[data-style]').forEach(btn=>btn.addEventListener('click',()=>{state.style=btn.dataset.style;save();render();toast(t().styleChosen+state.style)}));
render();