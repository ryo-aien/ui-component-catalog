const cards=[...document.querySelectorAll('.card')];
const search=document.getElementById('search');
let active='all';

const categoryLabels={all:'すべて',input:'入力・フォーム',navigation:'ナビゲーション',feedback:'状態・通知',overlay:'オーバーレイ',content:'表示・コンテンツ',dashboard:'ダッシュボード',library:'ライブラリUI'};

function updateSidebarCounts(){
 Object.keys(categoryLabels).forEach(key=>{
  const el=document.querySelector(`[data-count="${key}"]`);
  if(!el) return;
  const count=key==='all'?cards.length:cards.filter(c=>(c.dataset.tags||'').includes(key)).length;
  el.textContent=count;
 });
}

function applyFilter(){
 const q=search.value.trim().toLowerCase();
 let visible=0;
 cards.forEach(c=>{
  const text=(c.innerText+' '+(c.dataset.tags||'')).toLowerCase();
  const okText=!q||text.includes(q);
  const okCat=active==='all'||(c.dataset.tags||'').includes(active);
  const show=okText&&okCat;
  c.style.display=show?'':'none';
  if(show) visible++;
 });
 document.querySelectorAll('.section-title').forEach(title=>{
  let node=title.nextElementSibling, hasVisible=false;
  while(node && !node.classList.contains('section-title')){
   if(node.classList.contains('card') && node.style.display!=='none'){hasVisible=true;break;}
   node=node.nextElementSibling;
  }
  title.style.display=hasVisible?'':'none';
 });
 const current=document.getElementById('catalogCurrent');
 const count=document.getElementById('visibleCount');
 if(current) current.textContent=categoryLabels[active]||'すべて';
 if(count) count.textContent=visible;
}
search.addEventListener('input',applyFilter);
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
 b.classList.add('active'); active=b.dataset.filter; applyFilter();
}));
updateSidebarCounts();
applyFilter();

document.querySelectorAll('.copy').forEach(btn=>btn.addEventListener('click',async()=>{
 const text=btn.previousElementSibling?.innerText || '';
 let copied=false;
 try{
  if(navigator.clipboard && window.isSecureContext){
   await navigator.clipboard.writeText(text);
   copied=true;
  }
 }catch(e){}
 if(!copied){
  const ta=document.createElement('textarea');
  ta.value=text;
  ta.setAttribute('readonly','');
  ta.style.position='fixed';
  ta.style.opacity='0';
  document.body.appendChild(ta);
  ta.select();
  try{copied=document.execCommand('copy')}catch(e){}
  ta.remove();
 }
 const old=btn.innerText;
 btn.innerText=copied?'コピーしました':'コピーできませんでした';
 setTimeout(()=>btn.innerText=old,1000);
}));

// toggle
document.querySelectorAll('.toggle').forEach(btn=>{
 btn.dataset.bound='1';
 btn.addEventListener('click',()=>{
  btn.classList.toggle('on');
  btn.setAttribute('aria-pressed',btn.classList.contains('on'));
 });
});

// hamburger
document.querySelectorAll('.hamb').forEach(btn=>{
 const phone=btn.closest('.phone'), drawer=phone.querySelector('.mobile-drawer');
 btn.addEventListener('click',()=>drawer.classList.add('open'));
 drawer.querySelector('.close').addEventListener('click',()=>drawer.classList.remove('open'));
});

// checkbox
document.querySelectorAll('.checkbox').forEach(btn=>btn.addEventListener('click',()=>{
 btn.classList.toggle('checked');
 btn.textContent=btn.classList.contains('checked')?'✓':'';
}));

// radio
document.querySelectorAll('.radio-group').forEach(group=>{
 const radios=[...group.querySelectorAll('.radio')];
 radios.forEach(r=>r.addEventListener('click',()=>{
  radios.forEach(x=>x.classList.remove('selected')); r.classList.add('selected');
 }));
});

// dropdown
document.querySelectorAll('.select-wrap').forEach(w=>{
 const trigger=w.querySelector('.select-trigger'), menu=w.querySelector('.select-menu'), label=w.querySelector('.selected-label');
 if(!trigger || !menu || !label) return;
 // Headless UI Listbox has its own keyboard/ARIA interaction handler.
 if(trigger.classList.contains('headless-lib')) return;
 trigger.addEventListener('click',()=>menu.classList.toggle('open'));
 menu.querySelectorAll('button').forEach(o=>o.addEventListener('click',()=>{
  label.textContent=o.textContent; menu.classList.remove('open');
 }));
});

// segmented
document.querySelectorAll('.segment').forEach(seg=>{
 if(seg.classList.contains('seg-switch')) return;
 seg.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
  seg.querySelectorAll('button').forEach(x=>x.classList.remove('active')); b.classList.add('active');
 }));
});

// range
document.querySelectorAll('.range-wrap').forEach(w=>{
 const r=w.querySelector('.range'), v=w.querySelector('.range-value');
 if(!r || !v) return;
 r.addEventListener('input',()=>v.textContent=r.value);
});

// date
document.querySelectorAll('.datebox').forEach(box=>{
 const t=box.querySelector('.date-trigger'), cal=box.querySelector('.calendar');
 if(!t || !cal) return;
 t.addEventListener('click',()=>cal.classList.toggle('open'));
 cal.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
  cal.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));
  b.classList.add('sel'); t.textContent='2026-08-'+String(b.textContent).padStart(2,'0'); cal.classList.remove('open');
 }));
});

// tabs
document.querySelectorAll('.tabs').forEach(tabs=>{
 const panel=tabs.querySelector('.tab-panel');
 tabs.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{
  tabs.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  panel.textContent=b.textContent+' content';
 }));
});

// pagination
document.querySelectorAll('.pagination').forEach(p=>{
 let current=1;
 const nums=[...p.querySelectorAll('.num')], text=p.parentElement.querySelector('.page-text');
 function set(n){current=Math.max(1,Math.min(3,n)); nums.forEach((b,i)=>b.classList.toggle('active',i+1===current)); text.textContent='Page '+current}
 nums.forEach((b,i)=>b.addEventListener('click',()=>set(i+1)));
 p.querySelector('.prev').addEventListener('click',()=>set(current-1));
 p.querySelector('.next').addEventListener('click',()=>set(current+1));
});

// live search
const projects=['Alpha','Beta','Gamma','Delta','Omega'];
document.querySelectorAll('.live-search').forEach(inp=>{
 const out=inp.parentElement.querySelector('.search-results');
 inp.addEventListener('input',()=>{
  const q=inp.value.toLowerCase();
  out.innerHTML=q?projects.filter(x=>x.toLowerCase().includes(q)).map(x=>`<div class="result-item">${x}</div>`).join(''):'';
 });
});

// command palette
document.querySelectorAll('.command-btn').forEach(btn=>{
 const demo=btn.closest('.demo'), overlay=demo.querySelector('.command-overlay');
 btn.addEventListener('click',()=>overlay.classList.add('open'));
 overlay.addEventListener('click',e=>{if(e.target===overlay) overlay.classList.remove('open')});
});
document.addEventListener('keydown',e=>{
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){
  e.preventDefault();
  const overlay=document.querySelector('.command-overlay'); if(overlay) overlay.classList.add('open');
 }
 if(e.key==='Escape') document.querySelectorAll('.command-overlay.open,.modal-bg.open').forEach(x=>x.classList.remove('open'));
});

// toast
document.querySelectorAll('.toast-btn').forEach(btn=>{
 const toast=btn.parentElement.querySelector('.toast');
 btn.addEventListener('click',()=>{toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1800)});
});

// progress
document.querySelectorAll('.progress-wrap').forEach(w=>{
 let val=20; const fill=w.querySelector('.fill'), text=w.querySelector('.range-value');
 function set(v){val=Math.max(0,Math.min(100,v));fill.style.width=val+'%';text.textContent=val+'%'}
 w.querySelector('.plus').addEventListener('click',()=>set(val+10));
 w.querySelector('.minus').addEventListener('click',()=>set(val-10));
});

// stepper
document.querySelectorAll('.stepper-wrap').forEach(w=>{
 let current=0; const steps=[...w.querySelectorAll('.step')];
 function render(){steps.forEach((s,i)=>{s.classList.toggle('active',i===current);s.classList.toggle('done',i<current)})}
 w.querySelector('.next-step').addEventListener('click',()=>{current=Math.min(steps.length-1,current+1);render()});
 w.querySelector('.back').addEventListener('click',()=>{current=Math.max(0,current-1);render()});
});

// popover
document.querySelectorAll('.pop-anchor').forEach(a=>{
 const trigger=a.querySelector('.popover-trigger'), pop=a.querySelector('.popover');
 if(!trigger || !pop) return;
 trigger.addEventListener('click',()=>pop.classList.toggle('open'));
});

// modal
document.querySelectorAll('.modal-btn').forEach(btn=>{
 const demo=btn.closest('.demo'), bg=demo.querySelector('.modal-bg');
 btn.addEventListener('click',()=>bg.classList.add('open'));
 bg.querySelector('.cancel').addEventListener('click',()=>bg.classList.remove('open'));
 bg.querySelector('.confirm').addEventListener('click',()=>bg.classList.remove('open'));
 bg.addEventListener('click',e=>{if(e.target===bg) bg.classList.remove('open')});
});

// drawer
document.querySelectorAll('.drawer-btn').forEach(btn=>{
 const demo=btn.closest('.demo'), drawer=demo.querySelector('.drawer'), bg=demo.querySelector('.drawer-bg');
 function close(){drawer.classList.remove('open'); bg.classList.remove('open')}
 btn.addEventListener('click',()=>{drawer.classList.add('open');bg.classList.add('open')});
 drawer.querySelector('.close').addEventListener('click',close); bg.addEventListener('click',close);
});

// accordion
document.querySelectorAll('.accord-item').forEach(item=>{
 item.querySelector('.accord-head').addEventListener('click',()=>{
  item.classList.toggle('open');
  item.querySelector('.accord-head span').textContent=item.classList.contains('open')?'⌃':'⌄';
 });
});

// chips
document.querySelectorAll('.chiprow').forEach(row=>row.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('active'))));



// sortable data table
document.querySelectorAll('.table').forEach(table=>{
 let asc=true;
 const sort=table.querySelector('.sort');
 if(!sort) return;
 sort.addEventListener('click',()=>{
  const rows=[...table.querySelectorAll('.data-row')];
  rows.sort((a,b)=>{
   const av=a.children[0].textContent, bv=b.children[0].textContent;
   return asc?av.localeCompare(bv):bv.localeCompare(av);
  });
  rows.forEach(r=>table.appendChild(r));
  asc=!asc;
  sort.textContent='Name '+(asc?'↕':'↕');
 });
});

// fab
document.querySelectorAll('.fab').forEach(btn=>{
 const msg=btn.parentElement.querySelector('.fab-msg');
 btn.addEventListener('click',()=>{msg.textContent='Create action triggered';setTimeout(()=>msg.textContent='',1400)});
});

// empty state
document.querySelectorAll('.create-project').forEach(btn=>{
 btn.addEventListener('click',()=>{
  const root=btn.closest('.empty');
  root.querySelector('.circle').style.background='#cde7d6';
  root.querySelector('.empty-title').textContent='Project created';
  root.querySelector('.empty-copy').textContent='Your first project is ready.';
  btn.textContent='Open project';
 });
});


// ===== Added list-pattern interactions =====

// selectable list
document.querySelectorAll('.select-list').forEach(list=>{
 list.querySelectorAll('.list-row').forEach(row=>row.addEventListener('click',()=>{
  list.querySelectorAll('.list-row').forEach(r=>r.classList.remove('selected'));
  row.classList.add('selected');
 }));
});

// tree view
document.querySelectorAll('.tree-row.parent').forEach(row=>{
 row.addEventListener('click',()=>{
  const next=row.nextElementSibling;
  if(next && next.classList.contains('tree-children')){
   next.classList.toggle('hidden');
   const caret=row.querySelector('.tree-caret');
   caret.textContent=next.classList.contains('hidden')?'›':'⌄';
  }
 });
});

// notification read/unread
document.querySelectorAll('.notification-row').forEach(row=>{
 row.addEventListener('click',()=>{
  row.classList.toggle('unread');
  row.classList.toggle('read');
 });
});

// swipe action simulation
document.querySelectorAll('.swipe-shell').forEach(shell=>{
 shell.querySelector('.swipe-content').addEventListener('click',()=>shell.classList.toggle('open'));
 shell.querySelectorAll('.swipe-actions button').forEach(btn=>btn.addEventListener('click',()=>{
  if(btn.classList.contains('delete')) shell.remove();
  else shell.classList.remove('open');
 }));
});

// master detail
document.querySelectorAll('.master-detail').forEach(md=>{
 const detail=md.querySelector('.detail');
 md.querySelectorAll('.master button').forEach(btn=>btn.addEventListener('click',()=>{
  md.querySelectorAll('.master button').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  const title=btn.dataset.title;
  detail.innerHTML='<h4>'+title+'</h4><div>Details for '+title+'. The list remains visible for fast switching.</div>';
 }));
});

// Populate large scroll list
document.querySelectorAll('.virtual-list').forEach(list=>{
 if(list.children.length===0){
  for(let i=1;i<=120;i++){
   const row=document.createElement('div');
   row.className='virtual-row';
   row.textContent='Row '+String(i).padStart(3,'0')+' — Example record';
   list.appendChild(row);
  }
 }
});

// reorder list
document.querySelectorAll('.reorder-list').forEach(list=>{
 list.addEventListener('click',e=>{
  const btn=e.target.closest('button'); if(!btn) return;
  const row=btn.closest('.reorder-row');
  if(btn.classList.contains('up') && row.previousElementSibling) list.insertBefore(row,row.previousElementSibling);
  if(btn.classList.contains('down') && row.nextElementSibling) list.insertBefore(row.nextElementSibling,row);
 });
});

// inline edit feedback
document.querySelectorAll('.inline-edit').forEach(list=>{
 list.querySelectorAll('.edit-save').forEach(btn=>btn.addEventListener('click',()=>{
  const old=btn.textContent; btn.textContent='Saved'; setTimeout(()=>btn.textContent=old,900);
 }));
});

// kanban selection demo
document.querySelectorAll('.kan-card').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('selected')));


// ===== Interactions for additional list patterns =====
document.querySelectorAll('.inbox-row').forEach(row=>{
 row.addEventListener('click',e=>{
  if(e.target.closest('.star-btn')) return;
  row.classList.remove('unread');
 });
 const star=row.querySelector('.star-btn');
 star.addEventListener('click',e=>{e.stopPropagation(); star.classList.toggle('on'); star.textContent=star.classList.contains('on')?'★':'☆';});
});

document.querySelectorAll('.file-row').forEach(row=>row.addEventListener('click',()=>{
 const list=row.closest('.file-list'); list.querySelectorAll('.file-row').forEach(x=>x.classList.remove('selected')); row.classList.add('selected');
}));

document.querySelectorAll('.command-list').forEach(list=>{
 list.querySelectorAll('.cmd-row').forEach(row=>row.addEventListener('click',()=>{
  list.querySelectorAll('.cmd-row').forEach(x=>x.classList.remove('active')); row.classList.add('active');
 }));
});

document.querySelectorAll('.task-check').forEach(btn=>btn.addEventListener('click',()=>{
 const row=btn.closest('.check-row2'); row.classList.toggle('done'); btn.classList.toggle('done'); btn.textContent=btn.classList.contains('done')?'✓':'';
}));

document.querySelectorAll('.filter-row').forEach(row=>row.addEventListener('click',()=>row.classList.toggle('active')));

document.querySelectorAll('.queue-cycle').forEach(btn=>btn.addEventListener('click',()=>{
 const rows=btn.closest('.demo').querySelectorAll('.queue-state');
 rows.forEach(s=>{
  const txt=s.textContent.trim();
  s.classList.remove('run','fail');
  if(txt==='Queued'){s.textContent='Running';s.classList.add('run')}
  else if(txt==='Running'){s.textContent='Failed';s.classList.add('fail')}
  else{s.textContent='Queued'}
 });
}));

document.querySelectorAll('.person-row').forEach(row=>row.addEventListener('click',()=>row.classList.toggle('selected')));

document.querySelectorAll('.disclosure-row').forEach(row=>{
 row.querySelector('.disclosure-head').addEventListener('click',()=>{
  row.classList.toggle('open');
  row.querySelector('.disclosure-head span').textContent=row.classList.contains('open')?'⌃':'⌄';
 });
});

document.querySelectorAll('.batch-list').forEach(list=>{
 const rows=[...list.querySelectorAll('.batch-row')], bar=list.querySelector('.batch-toolbar'), count=list.querySelector('.batch-count');
 function render(){const n=rows.filter(r=>r.classList.contains('selected')).length;count.textContent=n+' selected';bar.classList.toggle('show',n>0)}
 rows.forEach(row=>row.addEventListener('click',()=>{row.classList.toggle('selected');render()}));
});

document.querySelectorAll('.pinned-list').forEach(list=>{
 list.querySelectorAll('.pin-action').forEach(btn=>btn.addEventListener('click',()=>{
  const row=btn.closest('.pin-row');
  if(btn.textContent.trim()==='×'){btn.textContent='＋';row.querySelector('.pin-ico').textContent='•'}
  else{btn.textContent='×';row.querySelector('.pin-ico').textContent='📌'}
 }));
});

document.querySelectorAll('.nav-list').forEach(list=>{
 list.querySelectorAll('.nav-row').forEach(row=>row.addEventListener('click',()=>{
  list.querySelectorAll('.nav-row').forEach(x=>x.classList.remove('active')); row.classList.add('active');
 }));
});


// Forms
document.querySelectorAll('.demo-form').forEach(form=>form.addEventListener('submit',e=>{
 e.preventDefault();
 const btn=form.querySelector('.primary'); const old=btn.textContent; btn.textContent='Saved'; setTimeout(()=>btn.textContent=old,1000);
}));
document.querySelectorAll('.inline-submit').forEach(btn=>btn.addEventListener('click',()=>{
 const old=btn.textContent; btn.textContent='Added'; setTimeout(()=>btn.textContent=old,900);
}));

// Wizard
document.querySelectorAll('.wizard-form').forEach(w=>{
 let i=0; const steps=[...w.querySelectorAll('.wiz-step')];
 const render=()=>steps.forEach((s,idx)=>{s.classList.toggle('active',idx===i);s.classList.toggle('done',idx<i)});
 w.querySelector('.wizard-next').addEventListener('click',()=>{i=Math.min(steps.length-1,i+1);render()});
 w.querySelector('.wizard-back').addEventListener('click',()=>{i=Math.max(0,i-1);render()});
});

// Combobox
document.querySelectorAll('.combo').forEach(c=>{
 const inp=c.querySelector('.combo-input'), menu=c.querySelector('.combo-menu');
 inp.addEventListener('input',()=>menu.classList.add('open'));
 inp.addEventListener('focus',()=>menu.classList.add('open'));
 c.querySelectorAll('.combo-item').forEach(item=>item.addEventListener('click',()=>{inp.value=item.textContent;menu.classList.remove('open')}));
});

// Filter bar
document.querySelectorAll('.filter-bar').forEach(bar=>bar.querySelectorAll('.filter-pill').forEach(btn=>btn.addEventListener('click',()=>{
 bar.querySelectorAll('.filter-pill').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
})));
document.querySelectorAll('.token-filter .filter-token button').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.remove()));

// Advanced filter
document.querySelectorAll('.advanced-filter').forEach(box=>{
 box.addEventListener('click',e=>{
  if(e.target.classList.contains('rule-remove')) e.target.closest('.rule').remove();
  if(e.target.classList.contains('add-rule')){
   const r=document.createElement('div');r.className='rule';r.innerHTML='<select><option>Label</option><option>Owner</option></select><input value=""><button class="rule-remove">×</button>';
   box.insertBefore(r,e.target);
  }
 })
});

// Table selection
document.querySelectorAll('.selectable-table .trow:not(.head)').forEach(row=>{
 row.querySelector('.rowcheck').addEventListener('click',()=>row.classList.toggle('selected'));
});

// Sort table
document.querySelectorAll('.sortable-table2').forEach(table=>{
 let asc=true; const btn=table.querySelector('.col-sort');
 btn.addEventListener('click',()=>{
  const rows=[...table.querySelectorAll('.trow.data')].sort((a,b)=>{
   const av=a.children[1].textContent,bv=b.children[1].textContent;
   return asc?av.localeCompare(bv):bv.localeCompare(av);
  });
  rows.forEach(r=>table.appendChild(r)); asc=!asc;
 });
});

// Tree table
document.querySelectorAll('.tree-table').forEach(table=>{
 const btn=table.querySelector('.tree-toggle');
 btn.addEventListener('click',()=>{
  const rows=[...table.querySelectorAll('.tree-child')]; const hide=rows[0].style.display!=='none';
  rows.forEach(r=>r.style.display=hide?'none':'grid'); btn.textContent=hide?'›':'⌄';
 });
});

// Sticky demo rows
document.querySelectorAll('#stickyDemo').forEach(table=>{
 table.innerHTML='<div class="trow head"><div></div><div>Name</div><div>Status</div><div>Owner</div><div>ARR</div></div>';
 for(let i=1;i<=15;i++) table.innerHTML+=`<div class="trow"><div></div><div>Account ${i}</div><div>Active</div><div>User ${i}</div><div>${(2+i/3).toFixed(1)}m</div></div>`;
});

// Bottom sheet
document.querySelectorAll('.bottom-sheet-phone').forEach(p=>{
 const b=p.querySelector('.open-sheet'), bg=p.querySelector('.sheet-bg'), panel=p.querySelector('.bottom-sheet-panel');
 const close=()=>{bg.classList.remove('open');panel.classList.remove('open')};
 b.addEventListener('click',()=>{bg.classList.add('open');panel.classList.add('open')});bg.addEventListener('click',close);
});

// Action sheet
document.querySelectorAll('.action-sheet-phone').forEach(p=>{
 const b=p.querySelector('.open-action'), bg=p.querySelector('.sheet-bg'), sheet=p.querySelector('.action-sheet');
 const close=()=>{bg.classList.remove('open');sheet.classList.remove('open')};
 b.addEventListener('click',()=>{bg.classList.add('open');sheet.classList.add('open')});bg.addEventListener('click',close);p.querySelector('.cancel-action').addEventListener('click',close);
});

// Pull refresh simulation
document.querySelectorAll('.pull-phone').forEach(p=>{
 const btn=p.querySelector('.refresh-btn'), ind=p.querySelector('.pull-indicator');
 btn.addEventListener('click',()=>{ind.textContent='Refreshing…';setTimeout(()=>ind.textContent='Updated just now',900)});
});

// Swipe tabs
document.querySelectorAll('.swipe-phone').forEach(p=>{
 const page=p.querySelector('.swipe-page');
 p.querySelectorAll('.swipe-tabbar button').forEach(b=>b.addEventListener('click',()=>{
  p.querySelectorAll('.swipe-tabbar button').forEach(x=>x.classList.remove('active'));b.classList.add('active');page.textContent=b.textContent+' content';
 }))
});

// FAB menu
document.querySelectorAll('.fab-phone').forEach(p=>p.querySelector('.fab-menu-main').addEventListener('click',()=>p.classList.toggle('open')));

// Segmented dashboard
document.querySelectorAll('.seg-dashboard').forEach(d=>{
 const metric=d.querySelector('.seg-metric'), copy=d.querySelector('.seg-content div:last-child');
 const vals={Revenue:['¥8.4m','Revenue this month'],Users:['18.4k','Monthly active users'],Errors:['0.2%','Error rate']};
 d.querySelectorAll('.seg-switch button').forEach(b=>b.addEventListener('click',()=>{
  d.querySelectorAll('.seg-switch button').forEach(x=>x.classList.remove('active'));b.classList.add('active');metric.textContent=vals[b.textContent][0];copy.textContent=vals[b.textContent][1];
 }));
});


// library interactions
document.querySelectorAll('.grid-layout-lib').forEach(layout=>{
 const toggle=layout.querySelector('.grid-layout-toggle');
 toggle.addEventListener('click',()=>{const compact=layout.classList.toggle('compact');toggle.textContent=compact?'Comfortable':'Compact';toggle.setAttribute('aria-pressed',compact)});
});
document.querySelectorAll('.treemap-lib').forEach(map=>{
 const detail=map.closest('.demo').querySelector('.tree-selection');
 map.querySelectorAll('.tree-block').forEach(block=>block.addEventListener('click',()=>{map.querySelectorAll('.tree-block').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected','false')});block.classList.add('active');block.setAttribute('aria-selected','true');detail.textContent=`${block.textContent.replace(/\s+/g,' ').trim()} · selected`; }));
});
document.querySelectorAll('.flow-lib').forEach(flow=>{
 const status=flow.closest('.demo').querySelector('.flow-status');
 flow.querySelectorAll('.flow-node').forEach(node=>node.addEventListener('click',()=>{flow.querySelectorAll('.flow-node').forEach(x=>x.classList.remove('active'));node.classList.add('active');status.textContent=`${node.dataset.service} · Healthy`; }));
});
document.querySelectorAll('.timeline-lib').forEach(timeline=>{
 const detail=timeline.closest('.demo').querySelector('.timeline-detail');
 timeline.querySelectorAll('.timeline-event').forEach(event=>event.addEventListener('click',()=>{timeline.querySelectorAll('.timeline-event').forEach(x=>x.classList.remove('active'));event.classList.add('active');detail.textContent=event.dataset.detail;}));
});
document.querySelectorAll('.bar-list-lib').forEach(list=>{
 const detail=list.closest('.demo').querySelector('.bar-list-detail');
 list.querySelectorAll('button').forEach(item=>item.addEventListener('click',()=>{list.querySelectorAll('button').forEach(x=>x.classList.remove('active'));item.classList.add('active');detail.textContent=`${item.dataset.name} · ${item.dataset.value} subscriptions`;}));
});
document.querySelectorAll('.dash-drill').forEach(table=>{const trigger=table.querySelector('.dash-drill-trigger');trigger.addEventListener('click',()=>{const open=table.classList.toggle('open');trigger.textContent=(open?'⌄':'›')+' Enterprise';const value=document.createElement('b');value.textContent='¥4.2m';trigger.appendChild(value);trigger.setAttribute('aria-expanded',open);});});
document.querySelectorAll('.dash-period').forEach(period=>period.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{period.querySelectorAll('button').forEach(x=>x.classList.remove('active'));button.classList.add('active');})));
document.querySelectorAll('.dash-columns').forEach(columns=>{const trigger=columns.querySelector('.dash-column-trigger');trigger.addEventListener('click',()=>columns.classList.toggle('open'));columns.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{trigger.textContent=`Columns ${columns.querySelectorAll('input:checked').length}/4 ⌄`;}));});
document.querySelectorAll('.incident').forEach(list=>list.querySelectorAll('button').forEach(item=>item.addEventListener('click',()=>{list.querySelectorAll('button').forEach(x=>x.classList.remove('active'));item.classList.add('active');})));
document.querySelectorAll('.experiment').forEach(test=>test.querySelectorAll('button').forEach(item=>item.addEventListener('click',()=>{test.querySelectorAll('button').forEach(x=>x.classList.remove('active'));item.classList.add('active');})));
document.querySelectorAll('.savedviews').forEach(views=>views.querySelectorAll('button').forEach(item=>item.addEventListener('click',()=>{views.querySelectorAll('button').forEach(x=>x.classList.remove('active'));item.classList.add('active');})));
document.querySelectorAll('.breakpoint').forEach(view=>view.querySelectorAll('button').forEach(item=>item.addEventListener('click',()=>{view.querySelectorAll('button').forEach(x=>x.classList.remove('active'));item.classList.add('active');})));
document.querySelectorAll('.dash-calendar').forEach(calendar=>calendar.querySelectorAll('button').forEach((day,index)=>day.addEventListener('click',()=>{calendar.querySelectorAll('button').forEach(x=>x.classList.remove('active'));day.classList.add('active');calendar.closest('.demo').querySelector('.dash-detail').textContent=`Aug ${index + 1} · ${day.classList.contains('high')?'99.9':'98.7'}% availability`;})));
document.querySelectorAll('.dash-waterfall').forEach(chart=>{const labels=['Opening MRR','Expansion','Contraction','Churn','Closing MRR'];chart.querySelectorAll('i').forEach((bar,index)=>bar.addEventListener('click',()=>{chart.querySelectorAll('i').forEach(x=>x.classList.remove('active'));bar.classList.add('active');chart.closest('.demo').querySelector('.dash-detail').textContent=`${labels[index]} · ${bar.classList.contains('down')?'−':'+'}${[8.4,.8,.3,.5,8.4][index]}m`; }));});
document.querySelectorAll('.dash-radar').forEach(chart=>chart.addEventListener('click',()=>{chart.classList.toggle('active');chart.closest('.demo').querySelector('.dash-detail').textContent=chart.classList.contains('active')?'Selected release · quality leads':'Current release · balanced profile';}));
document.querySelectorAll('.dash-pivot').forEach(table=>table.querySelectorAll('span').forEach(cell=>cell.addEventListener('click',()=>{table.querySelectorAll('span').forEach(x=>x.classList.remove('active'));cell.classList.add('active');table.closest('.demo').querySelector('.dash-detail').textContent=`Selected value · ${cell.textContent}`;})));
document.querySelectorAll('.dash-scatter').forEach(chart=>chart.querySelectorAll('i').forEach((point,index)=>point.addEventListener('click',()=>{chart.querySelectorAll('i').forEach(x=>x.classList.remove('active'));point.classList.add('active');chart.closest('.demo').querySelector('.dash-detail').textContent=`Service ${index + 1} · ${point.classList.contains('outlier')?'outlier detected':'within expected range'}`;})));
document.querySelectorAll('.dash-map').forEach(map=>map.querySelectorAll('.pin').forEach(pin=>pin.addEventListener('click',()=>{map.querySelectorAll('.pin').forEach(x=>x.classList.remove('active'));pin.classList.add('active');map.closest('.demo').querySelector('.dash-detail').textContent=`Region selected · ${pin.textContent} active sessions`;})));
document.querySelectorAll('.dash-sankey').forEach(chart=>chart.querySelectorAll('span').forEach((node,index)=>node.addEventListener('click',()=>{chart.querySelectorAll('span').forEach(x=>x.classList.remove('active'));node.classList.add('active');chart.closest('.demo').querySelector('.dash-detail').textContent=`${node.textContent} · ${[12400,2480,842][index].toLocaleString()} users`; })));
document.querySelectorAll('.boxplot').forEach(chart=>chart.querySelectorAll('i').forEach((box,index)=>box.addEventListener('click',()=>{chart.querySelectorAll('i').forEach(x=>x.classList.remove('active'));box.classList.add('active');chart.closest('.demo').querySelector('.dash-detail').textContent=`${['APAC','EMEA','Americas'][index]} · median 184ms`; })));
document.querySelectorAll('.forecast').forEach(chart=>chart.addEventListener('click',()=>{chart.classList.toggle('active');chart.closest('.demo').querySelector('.dash-detail').textContent=chart.classList.contains('active')?'Optimistic scenario · 14.2k–16.8k':'Forecast range · next 14 days';}));
document.querySelectorAll('.stream').forEach(chart=>chart.querySelectorAll('i').forEach((layer,index)=>layer.addEventListener('click',()=>{chart.querySelectorAll('i').forEach(x=>x.classList.remove('active'));layer.classList.add('active');chart.closest('.demo').querySelector('.dash-detail').textContent=`${['Organic','Paid','Referral'][index]} · selected series`; })));
document.querySelectorAll('.sunburst').forEach(chart=>chart.addEventListener('click',()=>{chart.classList.toggle('active');chart.closest('.demo').querySelector('.dash-detail').textContent=chart.classList.contains('active')?'Selected: Product / Team plan':'Products → plans → add-ons';}));
document.querySelectorAll('.chord').forEach(chart=>chart.querySelectorAll('i,b,em').forEach((arc,index)=>arc.addEventListener('click',()=>{chart.querySelectorAll('i,b,em').forEach(x=>x.classList.remove('active'));arc.classList.add('active');chart.closest('.demo').querySelector('.dash-detail').textContent=`${['Design','Engineering','Support'][index]} · 38 shared projects`; })));
document.querySelectorAll('.control').forEach(chart=>chart.addEventListener('click',()=>{chart.classList.toggle('active');chart.closest('.demo').querySelector('.dash-detail').textContent=chart.classList.contains('active')?'Alert point · 412ms exceeds threshold':'p95 latency · within control limits';}));
document.querySelectorAll('.logstream').forEach(log=>log.querySelectorAll('span').forEach(line=>line.addEventListener('click',()=>{log.querySelectorAll('span').forEach(x=>x.classList.remove('active'));line.classList.add('active');log.closest('.demo').querySelector('.dash-detail').textContent=`Selected: ${line.textContent.trim()}`;})));
document.querySelectorAll('.cohort').forEach(grid=>grid.querySelectorAll('i').forEach((cell,index)=>cell.addEventListener('click',()=>{grid.querySelectorAll('i').forEach(x=>x.classList.remove('active'));cell.classList.add('active');grid.closest('.demo').querySelector('.dash-detail').textContent=`Cohort cell ${index + 1} · retention 64% (n=382)`;})));
document.querySelectorAll('.burn').forEach(widget=>widget.addEventListener('click',()=>{widget.classList.toggle('critical');widget.closest('.demo').querySelector('.dash-detail').textContent=widget.classList.contains('critical')?'Alert threshold exceeded · page on-call':'Error budget remaining: 61%';}));
document.querySelectorAll('.rollout').forEach(rollout=>{const slider=rollout.querySelector('input'),value=rollout.querySelector('b'),detail=rollout.closest('.demo').querySelector('.dash-detail');slider.addEventListener('input',()=>{value.textContent=slider.value+'%';detail.textContent=`Gradual rollout · ${Math.round(Number(slider.value)*85.6)} users`;});});
document.querySelectorAll('.query').forEach(query=>query.querySelectorAll('button,em').forEach(part=>part.addEventListener('click',()=>{part.classList.toggle('active');query.closest('.demo').querySelector('.dash-detail').textContent=part.textContent.includes('AND')?'Added a second filter':'Filter part selected · edit condition';})));
document.querySelectorAll('.annotate').forEach(note=>note.addEventListener('click',()=>note.classList.toggle('open')));
document.querySelectorAll('.freshness').forEach(widget=>widget.querySelector('button').addEventListener('click',()=>{widget.querySelector('span').textContent='just now';widget.closest('.demo').querySelector('.demo-note').textContent='データを更新しました';}));
document.querySelectorAll('.dnd').forEach(zone=>{let dragged;zone.querySelectorAll('button').forEach(item=>{item.addEventListener('dragstart',()=>{dragged=item;item.classList.add('dragging');});item.addEventListener('dragend',()=>item.classList.remove('dragging'));});const target=zone.querySelector('div');target.addEventListener('dragover',event=>event.preventDefault());target.addEventListener('drop',event=>{event.preventDefault();if(!dragged)return;target.textContent=`Added: ${dragged.textContent.replace('⠿ ','')}`;zone.closest('.demo').querySelector('.demo-note').textContent='ウィジェットを追加しました';});});
document.querySelectorAll('.export').forEach(panel=>panel.querySelector('button').addEventListener('click',()=>{const button=panel.querySelector('button');button.textContent='Preparing…';setTimeout(()=>{button.textContent='PDF ready';panel.closest('.demo').querySelector('.demo-note').textContent='レポートを生成しました';},450);}));
document.querySelectorAll('.sheetframe').forEach(x=>{x.querySelector('.sheetlaunch').onclick=()=>x.classList.add('open');x.querySelector('.sheetshade').onclick=()=>x.classList.remove('open')});
document.querySelectorAll('.speedlib').forEach(x=>x.querySelector('.speedmain').onclick=()=>x.classList.toggle('open'));
document.querySelectorAll('.cascade').forEach(x=>{x.querySelector('.castrigger').onclick=()=>x.classList.toggle('open');x.querySelectorAll('.final').forEach(i=>i.onclick=()=>{x.querySelector('.caslabel').textContent='Japan / '+i.textContent;x.classList.remove('open')})});
function dualBind(sel){document.querySelectorAll(sel).forEach(x=>{let s=x.querySelector('.source'),t=x.querySelector('.target');x.querySelectorAll('.dualitem').forEach(i=>i.onclick=()=>i.classList.toggle('selected'));let mv=(a,b)=>[...a.querySelectorAll('.dualitem.selected')].forEach(i=>{i.classList.remove('selected');b.appendChild(i)});x.querySelector('.right').onclick=()=>mv(s,t);x.querySelector('.left').onclick=()=>mv(t,s)})}dualBind('.transferlib');dualBind('.picklib');
document.querySelectorAll('.chakra-select').forEach(x=>{let d=x.closest('.demo'),bar=d.querySelector('.chakra-bar');x.querySelectorAll('.librow').forEach(r=>r.onclick=()=>{r.classList.toggle('active');let n=x.querySelectorAll('.librow.active').length;bar.textContent=n+' selected · Archive · Delete';bar.classList.toggle('show',n>0)})});
document.querySelectorAll('.pinlib').forEach(x=>{let a=[...x.querySelectorAll('input')];a.forEach((i,n)=>i.oninput=()=>{if(i.value&&a[n+1])a[n+1].focus()})});
document.querySelectorAll('.headless-lib').forEach((trigger, instanceIndex) => {
 const wrap = trigger.closest('.select-wrap');
 const menu = wrap.querySelector('.headless-options');
 const label = trigger.querySelector('.selected-label');
 const options = [...menu.querySelectorAll('button')];
 let activeIndex = Math.max(0, options.findIndex(o => o.textContent.trim() === label.textContent.trim()));

 trigger.setAttribute('aria-haspopup', 'listbox');
 trigger.setAttribute('aria-expanded', 'false');
 menu.setAttribute('role', 'listbox');
 menu.id = menu.id || `headless-listbox-${instanceIndex}`;
 trigger.setAttribute('aria-controls', menu.id);

 options.forEach((opt, i) => {
  opt.setAttribute('role', 'option');
  opt.setAttribute('tabindex', '-1');
  opt.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
 });

 const paintActive = () => {
  options.forEach((opt, i) => {
   opt.classList.toggle('active', i === activeIndex);
   opt.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
  });
 };

 const open = () => {
  menu.classList.add('open');
  trigger.setAttribute('aria-expanded', 'true');
  activeIndex = Math.max(0, options.findIndex(o => o.textContent.trim() === label.textContent.trim()));
  paintActive();
 };

 const close = (restoreFocus = false) => {
  menu.classList.remove('open');
  trigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) trigger.focus();
 };

 const choose = (index) => {
  activeIndex = index;
  label.textContent = options[index].textContent.trim();
  paintActive();
  close(true);
 };

 trigger.addEventListener('click', (e) => {
  e.stopPropagation();
  if (menu.classList.contains('open')) close(); else open();
 });

 trigger.addEventListener('keydown', (e) => {
  if (['ArrowDown','ArrowUp','Enter',' '].includes(e.key)) {
   e.preventDefault();
   if (!menu.classList.contains('open')) open();
   if (e.key === 'ArrowDown') activeIndex = (activeIndex + 1) % options.length;
   if (e.key === 'ArrowUp') activeIndex = (activeIndex - 1 + options.length) % options.length;
   paintActive();
  } else if (e.key === 'Escape') {
   e.preventDefault();
   close();
  }
 });

 options.forEach((opt, i) => {
  opt.addEventListener('mouseenter', () => { activeIndex = i; paintActive(); });
  opt.addEventListener('click', (e) => { e.stopPropagation(); choose(i); });
  opt.addEventListener('keydown', (e) => {
   if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex=(i+1)%options.length; paintActive(); options[activeIndex].focus(); }
   if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex=(i-1+options.length)%options.length; paintActive(); options[activeIndex].focus(); }
   if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(i); }
   if (e.key === 'Escape') { e.preventDefault(); close(true); }
  });
 });

 document.addEventListener('click', (e) => {
  if (!wrap.contains(e.target)) close();
 });

 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('open')) close(true);
 });
});
document.querySelectorAll('.multi').forEach(x=>x.querySelector('.multiopen').onclick=()=>x.classList.toggle('open'));
document.querySelectorAll('.treeselect').forEach(x=>{x.querySelector('.tsopen').onclick=()=>x.classList.toggle('open');x.querySelectorAll('.tsitem.child').forEach(i=>i.onclick=()=>{x.querySelectorAll('.tsitem').forEach(y=>y.classList.remove('active'));i.classList.add('active');x.querySelector('.tslabel').textContent=i.textContent.trim();x.classList.remove('open')})});
document.querySelectorAll('.carousel-lib').forEach(x=>{let i=0,a=['Slide 1','Slide 2','Slide 3'];let r=()=>{x.querySelector('.cartext').textContent=a[i];x.querySelector('.cardots').textContent=a.map((_,n)=>n===i?'●':'○').join(' ')};x.querySelector('.carnext').onclick=()=>{i=(i+1)%3;r()};x.querySelector('.carprev').onclick=()=>{i=(i+2)%3;r()}});
document.querySelectorAll('.ratinglib').forEach(x=>{let s=[...x.querySelectorAll('button')];s.forEach((b,i)=>b.onclick=()=>s.forEach((y,n)=>y.classList.toggle('on',n<=i))) });


// Additional library primitives interactions
document.querySelectorAll('.ctx-area').forEach(area=>{
 const menu=area.querySelector('.ctx-menu');
 area.addEventListener('contextmenu',e=>{
  e.preventDefault();
  const r=area.getBoundingClientRect();
  menu.style.left=Math.min(e.clientX-r.left, area.clientWidth-145)+'px';
  menu.style.top=Math.min(e.clientY-r.top, area.clientHeight-95)+'px';
  menu.classList.add('open');
 });
 document.addEventListener('click',e=>{if(!area.contains(e.target))menu.classList.remove('open')});
});

document.querySelectorAll('.drop-root').forEach(root=>{
 const trig=root.querySelector('.drop-trigger');
 trig.addEventListener('click',()=>root.classList.toggle('open'));
 root.querySelectorAll('.drop-item').forEach(i=>i.addEventListener('click',()=>root.classList.remove('open')));
});

document.querySelectorAll('.sonner-trigger').forEach(btn=>{
 const stack=btn.closest('.demo').querySelector('.sonner-stack');
 let n=0;
 btn.addEventListener('click',()=>{
  n++;
  const t=document.createElement('div');
  t.className='sonner-toast '+(n%3===0?'error':n%2===0?'success':'');
  t.textContent=n%3===0?'Something went wrong':n%2===0?'Saved successfully':'Background task started';
  stack.appendChild(t);
  setTimeout(()=>t.remove(),2200);
 });
});

document.querySelectorAll('.collapsible').forEach(c=>{
 c.querySelector('.coll-head').addEventListener('click',()=>{
  c.classList.toggle('open');
  c.querySelector('.coll-head span').textContent=c.classList.contains('open')?'⌃':'⌄';
 });
});

document.querySelectorAll('.navmenu-root').forEach(root=>{
 const b=root.querySelector(':scope > button');
 if(b) b.addEventListener('click',()=>{
  document.querySelectorAll('.navmenu-root').forEach(x=>{if(x!==root)x.classList.remove('open')});
  root.classList.toggle('open');
 });
});

document.querySelectorAll('.pagination-lib').forEach(p=>{
 const nums=[...p.querySelectorAll('button')].filter(b=>/^\d+$/.test(b.textContent));
 nums.forEach(b=>b.addEventListener('click',()=>{nums.forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
});

document.querySelectorAll('.otp-wrap').forEach(w=>{
 const inputs=[...w.querySelectorAll('.otp-box')];
 inputs.forEach((inp,i)=>{
  inp.addEventListener('input',()=>{if(inp.value && inputs[i+1])inputs[i+1].focus()});
  inp.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!inp.value&&inputs[i-1])inputs[i-1].focus()});
 });
});

document.querySelectorAll('.progress-plus').forEach(btn=>{
 const fill=btn.parentElement.querySelector('.progress-lib > div');
 let v=46;
 btn.addEventListener('click',()=>{v=(v+10)%110;fill.style.width=Math.min(v,100)+'%'});
});

document.querySelectorAll('.calendar-lib').forEach(c=>{
 c.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
  c.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');
 }));
});

// Essential UI patterns
document.querySelectorAll('.sign-in-demo').forEach(form=>{
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const status=form.querySelector('.sign-in-status');
  status.textContent='Signed in successfully';
 });
});

document.querySelectorAll('.password-demo').forEach(demo=>{
 const input=demo.querySelector('input');
 const toggle=demo.querySelector('.password-toggle');
 toggle.addEventListener('click',()=>{
  const isVisible=input.type==='text';
  input.type=isVisible?'password':'text';
  toggle.textContent=isVisible?'表示':'隠す';
  toggle.setAttribute('aria-pressed',String(!isVisible));
 });
});

document.querySelectorAll('.alert-demo').forEach(alert=>{
 const demo=alert.closest('.demo');
 alert.querySelector('.alert-dismiss').addEventListener('click',()=>demo.classList.add('alert-hidden'));
 demo.querySelector('.alert-reset').addEventListener('click',()=>demo.classList.remove('alert-hidden'));
});

document.querySelectorAll('.color-picker-demo').forEach(demo=>{
 const input=demo.querySelector('.color-input');
 const swatch=demo.querySelector('.color-swatch');
 const value=demo.querySelector('.color-value');
 input.addEventListener('input',()=>{
  const color=input.value.toUpperCase();
  swatch.style.background=color;
  value.textContent=color;
 });
});
+


// Extended UI pattern interactions
document.querySelectorAll('.x-choice').forEach(group=>group.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{group.querySelectorAll('button').forEach(item=>item.classList.remove('active'));button.classList.add('active')})));
document.querySelectorAll('.x-split').forEach(split=>split.querySelector('.x-split-toggle').addEventListener('click',()=>split.classList.toggle('open')));
document.querySelectorAll('.x-textarea').forEach(field=>{const count=field.parentElement.querySelector('.x-count');field.addEventListener('input',()=>count.textContent=field.value.length+' / '+field.maxLength)});
document.querySelectorAll('.x-stepper').forEach(stepper=>{let value=1;const output=stepper.querySelector('output');const render=()=>output.textContent=value;stepper.querySelector('.x-minus').addEventListener('click',()=>{value=Math.max(0,value-1);render()});stepper.querySelector('.x-plus').addEventListener('click',()=>{value++;render()})});
document.querySelectorAll('.x-file').forEach(input=>input.addEventListener('change',()=>{const name=input.files[0]?.name;input.closest('.demo').querySelector('.x-file-name').textContent=name||''}));
document.querySelectorAll('.x-strength-input').forEach(input=>input.addEventListener('input',()=>{const n=input.value.length;const width=Math.min(100,n*12);const fill=input.parentElement.querySelector('.x-strength i');const label=input.parentElement.querySelector('.x-strength-label');fill.style.width=width+'%';fill.style.background=n>9?'#3b8b5c':n>5?'#c58a2f':'#d45656';label.textContent=n>9?'Strong password':n>5?'Medium password':'Use 6 or more characters'}));
document.querySelectorAll('.x-tag-input').forEach(box=>{const input=box.querySelector('input');const list=box.querySelector('.x-tag-list');input.addEventListener('keydown',event=>{if(event.key==='Enter'&&input.value.trim()){event.preventDefault();const tag=document.createElement('span');tag.textContent=input.value.trim();list.appendChild(tag);input.value=''}})});
document.querySelectorAll('.x-offline').forEach(banner=>banner.querySelector('.x-offline-close').addEventListener('click',()=>banner.remove()));
document.querySelectorAll('.x-confirm').forEach(box=>{box.querySelector('.x-confirm-trigger').addEventListener('click',()=>box.classList.add('open'));box.querySelector('.x-confirm-cancel').addEventListener('click',()=>box.classList.remove('open'));box.querySelector('.x-confirm-ok').addEventListener('click',()=>{box.classList.remove('open');box.querySelector('.x-confirm-trigger').textContent='Archived';box.querySelector('.x-confirm-trigger').disabled=true})});
document.querySelectorAll('.x-notifications button').forEach(item=>item.addEventListener('click',()=>item.classList.remove('unread')));
document.querySelectorAll('.x-code-copy').forEach(button=>button.addEventListener('click',()=>{button.textContent='Copied';setTimeout(()=>button.textContent='Copy',1000)}));
document.querySelectorAll('.x-comment').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const input=form.querySelector('input');if(!input.value.trim())return;form.querySelector('.x-comment-status').textContent='Comment posted';input.value=''}));
document.querySelectorAll('.x-gallery').forEach(gallery=>gallery.querySelectorAll('button').forEach(tile=>tile.addEventListener('click',()=>{gallery.querySelectorAll('button').forEach(item=>{item.classList.remove('active');item.setAttribute('aria-pressed','false')});tile.classList.add('active');tile.setAttribute('aria-pressed','true')})));
document.querySelectorAll('.x-rating').forEach(rating=>{const stars=[...rating.querySelectorAll('button')];const value=rating.querySelector('.x-rating-value');stars.forEach((star,index)=>star.addEventListener('click',()=>{stars.forEach((item,itemIndex)=>{item.classList.toggle('active',itemIndex<=index);item.setAttribute('aria-pressed',itemIndex<=index)});value.textContent=(index+1)+' / '+stars.length}))});
document.querySelectorAll('.x-otp').forEach(otp=>{const inputs=[...otp.querySelectorAll('input')];inputs.forEach((input,index)=>{input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(0,1);if(input.value&&inputs[index+1])inputs[index+1].focus()});input.addEventListener('keydown',event=>{if(event.key==='Backspace'&&!input.value&&inputs[index-1])inputs[index-1].focus()});input.addEventListener('paste',event=>{event.preventDefault();const digits=(event.clipboardData.getData('text')||'').replace(/\D/g,'').split('');digits.forEach((digit,offset)=>{if(inputs[index+offset])inputs[index+offset].value=digit});const next=inputs[Math.min(index+digits.length,inputs.length-1)];next.focus()})})});
document.querySelectorAll('.x-dual-range').forEach(range=>{const minInput=range.querySelector('.x-dual-min'),maxInput=range.querySelector('.x-dual-max'),fill=range.querySelector('.x-dual-fill'),value=range.querySelector('.x-dual-value');const render=()=>{let min=Number(minInput.value),max=Number(maxInput.value);if(min>max){[min,max]=[max,min];minInput.value=min;maxInput.value=max}fill.style.left=min+'%';fill.style.right=(100-max)+'%';value.textContent='¥'+min+' – ¥'+max};[minInput,maxInput].forEach(input=>input.addEventListener('input',render));render()});
document.querySelectorAll('.x-multiselect').forEach(box=>{const trigger=box.querySelector('.x-multiselect-trigger'),menu=box.querySelector('.x-multiselect-menu'),label=box.querySelector('.x-multiselect-label');trigger.addEventListener('click',()=>{const open=menu.classList.toggle('open');trigger.setAttribute('aria-expanded',open)});menu.querySelectorAll('input[type=checkbox]').forEach(checkbox=>checkbox.addEventListener('change',()=>{const count=menu.querySelectorAll('input:checked').length;label.textContent=count===0?'Select…':count+' selected'}))});
document.querySelectorAll('.x-sidebar-toggle').forEach(toggle=>toggle.addEventListener('click',()=>{const collapsed=toggle.parentElement.classList.toggle('collapsed');toggle.setAttribute('aria-expanded',!collapsed)}));
document.querySelectorAll('.x-ring').forEach(ring=>{const label=ring.querySelector('b');let pct=Number(getComputedStyle(ring).getPropertyValue('--pct'))||64;const render=()=>{ring.style.setProperty('--pct',pct);label.textContent=pct+'%'};ring.parentElement.querySelector('.x-ring-minus').addEventListener('click',()=>{pct=Math.max(0,pct-10);render()});ring.parentElement.querySelector('.x-ring-plus').addEventListener('click',()=>{pct=Math.min(100,pct+10);render()})});
document.querySelectorAll('.x-cooldown').forEach(box=>{const button=box.querySelector('.x-cooldown-btn'),note=box.querySelector('.x-cooldown-note');button.addEventListener('click',()=>{let remaining=15;button.disabled=true;const tick=()=>{note.textContent=remaining+'s後に再送できます';remaining--;if(remaining<0){clearInterval(timer);button.disabled=false;note.textContent=''}};tick();const timer=setInterval(tick,1000)})});
document.querySelectorAll('.x-lightbox-open').forEach(thumb=>thumb.addEventListener('click',()=>{const demo=thumb.closest('.demo');demo.querySelector('.x-lightbox-bg').classList.add('open');demo.querySelector('.x-lightbox').classList.add('open')}));
document.querySelectorAll('.x-lightbox-close').forEach(close=>close.addEventListener('click',()=>{const demo=close.closest('.demo');demo.querySelector('.x-lightbox-bg').classList.remove('open');demo.querySelector('.x-lightbox').classList.remove('open')}));
document.querySelectorAll('.x-coachmark-target').forEach(target=>target.addEventListener('click',()=>target.parentElement.querySelector('.x-coachmark').classList.toggle('open')));
document.querySelectorAll('.x-coachmark-next').forEach(button=>button.addEventListener('click',()=>button.closest('.x-coachmark').classList.remove('open')));
document.querySelectorAll('.x-confirm-input').forEach(input=>{const original=input.parentElement.querySelector('input[type=password]');const note=input.parentElement.querySelector('.x-match-note');input.addEventListener('input',()=>{if(!input.value){note.textContent='';note.className='x-match-note';return}const match=input.value===original.value;note.textContent=match?'パスワードが一致しました':'パスワードが一致しません';note.className='x-match-note '+(match?'match':'mismatch')})});
document.querySelectorAll('.x-keypad').forEach(pad=>{const dots=pad.parentElement.querySelectorAll('.x-keypad-dots i');let count=2;pad.querySelectorAll('button').forEach(key=>{if(!key.textContent)return;key.addEventListener('click',()=>{if(key.classList.contains('x-keypad-back')){count=Math.max(0,count-1)}else{count=Math.min(dots.length,count+1)}dots.forEach((dot,index)=>dot.classList.toggle('on',index<count))})})});
document.querySelectorAll('.x-vstepper').forEach(stepper=>stepper.querySelectorAll('.x-vstep').forEach((step,index,steps)=>step.addEventListener('click',()=>{steps.forEach((item,itemIndex)=>{item.classList.toggle('done',itemIndex<index);item.classList.toggle('active',itemIndex===index)})})));
document.querySelectorAll('.x-scrollspy').forEach(spy=>spy.querySelectorAll('a').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();spy.querySelectorAll('a').forEach(item=>item.classList.remove('active'));link.classList.add('active')})));
document.querySelectorAll('.x-countdown').forEach(countdown=>{let total=2*3600+14*60+8;const cells=countdown.querySelectorAll('b');const render=()=>{const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;cells[0].textContent=String(h).padStart(2,'0');cells[1].textContent=String(m).padStart(2,'0');cells[2].textContent=String(s).padStart(2,'0')};const timer=setInterval(()=>{total=Math.max(0,total-1);render();if(total===0)clearInterval(timer)},1000)});
document.querySelectorAll('.x-undo-trigger').forEach(trigger=>trigger.addEventListener('click',()=>{const toast=trigger.parentElement.querySelector('.x-undo-toast');toast.classList.add('show');const timer=setTimeout(()=>toast.classList.remove('show'),4000);toast.querySelector('.x-undo-btn').addEventListener('click',()=>{clearTimeout(timer);toast.classList.remove('show')},{once:true})}));
document.querySelectorAll('.x-onboard-row').forEach(row=>row.addEventListener('click',()=>{row.classList.toggle('done');row.querySelector('span').textContent=row.classList.contains('done')?'✓':'';const rows=[...row.parentElement.querySelectorAll('.x-onboard-row')];const doneCount=rows.filter(item=>item.classList.contains('done')).length;row.parentElement.querySelector('.x-onboard-bar i').style.width=(doneCount/rows.length*100)+'%'}));
document.querySelectorAll('.x-announce-close').forEach(close=>close.addEventListener('click',()=>close.closest('.x-announce').remove()));
document.querySelectorAll('.x-ctx-target').forEach(target=>target.addEventListener('contextmenu',event=>{event.preventDefault();const menu=target.parentElement.querySelector('.x-ctx-menu');menu.style.left=event.offsetX+'px';menu.style.top=event.offsetY+'px';menu.classList.add('open')}));
document.querySelectorAll('.x-ctx-menu').forEach(menu=>document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.classList.remove('open')}));
document.querySelectorAll('.x-video-open').forEach(button=>button.addEventListener('click',()=>{const demo=button.closest('.demo');demo.querySelector('.x-video-bg').classList.add('open');demo.querySelector('.x-video-modal').classList.add('open')}));
document.querySelectorAll('.x-video-close').forEach(close=>close.addEventListener('click',()=>{const demo=close.closest('.demo');demo.querySelector('.x-video-bg').classList.remove('open');demo.querySelector('.x-video-modal').classList.remove('open')}));
document.querySelectorAll('.x-share-trigger').forEach(trigger=>trigger.addEventListener('click',()=>trigger.closest('.x-share').classList.toggle('open')));
document.querySelectorAll('.x-feedback-fab').forEach(fab=>fab.addEventListener('click',()=>fab.closest('.x-feedback-widget').classList.toggle('open')));
document.querySelectorAll('.x-faq-q').forEach(question=>question.addEventListener('click',()=>question.closest('.x-faq-item').classList.toggle('open')));
document.querySelectorAll('.x-threshold-range').forEach(range=>range.addEventListener('input',()=>range.parentElement.querySelector('b').textContent=range.value+'%'));
document.querySelectorAll('.x-like-btn').forEach(button=>{const countEl=button.querySelector('span');let count=Number(countEl.textContent);button.addEventListener('click',()=>{const active=button.classList.toggle('active');button.setAttribute('aria-pressed',active);count+=active?1:-1;countEl.textContent=count;button.firstChild.textContent=active?'♥ ':'♡ '})});
document.querySelectorAll('.x-bookmark-btn').forEach(button=>button.addEventListener('click',()=>{const active=button.classList.toggle('active');button.setAttribute('aria-pressed',active);button.textContent=active?'🔖 保存済み':'🔖 保存する'}));
document.querySelectorAll('.x-chip-single').forEach(group=>group.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{group.querySelectorAll('button').forEach(item=>item.classList.remove('active'));button.classList.add('active')})));
document.querySelectorAll('.x-dial').forEach(dial=>{const value=dial.parentElement.querySelector('.x-dial-value');let pct=Number(getComputedStyle(dial).getPropertyValue('--deg'))/3.6||70;const render=()=>{dial.style.setProperty('--deg',pct*3.6);value.textContent=Math.round(pct)+'%'};dial.parentElement.querySelector('.x-dial-minus').addEventListener('click',()=>{pct=Math.max(0,pct-10);render()});dial.parentElement.querySelector('.x-dial-plus').addEventListener('click',()=>{pct=Math.min(100,pct+10);render()})});
document.querySelectorAll('.x-plan-cards').forEach(group=>group.querySelectorAll('.x-plan').forEach(plan=>plan.addEventListener('click',()=>{group.querySelectorAll('.x-plan').forEach(item=>item.classList.remove('active'));plan.classList.add('active')})));
document.querySelectorAll('.x-underline-tabs').forEach(tabs=>tabs.querySelectorAll('button').forEach(tab=>tab.addEventListener('click',()=>{tabs.querySelectorAll('button').forEach(item=>item.classList.remove('active'));tab.classList.add('active')})));
document.querySelectorAll('.x-rail').forEach(rail=>rail.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{rail.querySelectorAll('button').forEach(item=>item.classList.remove('active'));button.classList.add('active')})));
document.querySelectorAll('.x-load-more-btn').forEach(button=>button.addEventListener('click',()=>{const list=button.parentElement.querySelector('.x-load-list');const item=document.createElement('span');item.textContent='Item '+(list.children.length+1);list.appendChild(item);if(list.children.length>=6)button.remove()}));
document.querySelectorAll('.x-toast-stack-trigger').forEach(trigger=>trigger.addEventListener('click',()=>{const stack=trigger.parentElement.querySelector('.x-toast-stack');['アップロード完了','コメントを追加しました','招待を送信しました'].forEach((message,index)=>{setTimeout(()=>{const item=document.createElement('div');item.className='x-toast-item';item.textContent=message;stack.appendChild(item);setTimeout(()=>item.remove(),3000)},index*300)})}));
document.querySelectorAll('.x-loading-btn').forEach(button=>{const original=button.textContent;button.addEventListener('click',()=>{button.classList.add('loading');setTimeout(()=>{button.classList.remove('loading');button.textContent=original},1500)})});
document.querySelectorAll('.x-crop-frame').forEach(frame=>frame.querySelectorAll('.x-crop-handle').forEach(handle=>handle.addEventListener('mousedown',event=>event.preventDefault())));
document.querySelectorAll('.x-nested-open').forEach(button=>button.addEventListener('click',()=>{const demo=button.closest('.demo');demo.querySelector('.x-nested-bg').classList.add('open');demo.querySelector('.x-nested-modal').classList.add('open')}));
document.querySelectorAll('.x-nested-close').forEach(button=>button.addEventListener('click',()=>{const demo=button.closest('.demo');demo.querySelector('.x-nested-bg').classList.remove('open');demo.querySelector('.x-nested-modal').classList.remove('open')}));
document.querySelectorAll('.x-nested-inner-open').forEach(button=>button.addEventListener('click',()=>{const demo=button.closest('.demo');demo.querySelector('.x-nested-inner-bg').classList.add('open');demo.querySelector('.x-nested-inner-modal').classList.add('open')}));
document.querySelectorAll('.x-nested-inner-close').forEach(button=>button.addEventListener('click',()=>{const demo=button.closest('.demo');demo.querySelector('.x-nested-inner-bg').classList.remove('open');demo.querySelector('.x-nested-inner-modal').classList.remove('open')}));
document.querySelectorAll('.x-action-toast-trigger').forEach(trigger=>trigger.addEventListener('click',()=>{const toast=trigger.parentElement.querySelector('.x-action-toast');toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4000)}));
document.querySelectorAll('.x-action-toast-btn').forEach(button=>button.addEventListener('click',()=>{button.textContent='表示済み';button.disabled=true}));
document.querySelectorAll('.x-size-select').forEach(group=>group.querySelectorAll('button:not(:disabled)').forEach(button=>button.addEventListener('click',()=>{group.querySelectorAll('button').forEach(item=>item.classList.remove('active'));button.classList.add('active')})));
document.querySelectorAll('.x-coupon').forEach(box=>{const input=box.querySelector('input'),button=box.querySelector('button'),note=box.parentElement.querySelector('.x-coupon-note');button.addEventListener('click',()=>{note.textContent=input.value.trim()?'「'+input.value.trim()+'」を適用しました':'コードを入力してください'})});
document.querySelectorAll('.x-zip-input').forEach(input=>input.addEventListener('input',()=>{const output=input.closest('.x-stack').querySelector('.x-address-output');output.value=input.value.length>=7?'東京都渋谷区道玄坂2-1':''}));
document.querySelectorAll('.x-emoji-trigger').forEach(trigger=>trigger.addEventListener('click',()=>trigger.closest('.x-emoji-picker').classList.toggle('open')));
document.querySelectorAll('.x-emoji-menu').forEach(menu=>menu.querySelectorAll('button').forEach(emoji=>emoji.addEventListener('click',()=>{menu.closest('.x-emoji-picker').querySelector('.x-emoji-trigger').textContent=emoji.textContent;menu.closest('.x-emoji-picker').classList.remove('open')})));
document.querySelectorAll('.x-sigpad-canvas').forEach(canvas=>{const ctx=canvas.getContext('2d');ctx.strokeStyle='#111821';ctx.lineWidth=2;ctx.lineCap='round';let drawing=false;const pos=event=>{const rect=canvas.getBoundingClientRect();return{x:event.clientX-rect.left,y:event.clientY-rect.top}};canvas.addEventListener('pointerdown',event=>{drawing=true;const p=pos(event);ctx.beginPath();ctx.moveTo(p.x,p.y)});canvas.addEventListener('pointermove',event=>{if(!drawing)return;const p=pos(event);ctx.lineTo(p.x,p.y);ctx.stroke()});['pointerup','pointerleave'].forEach(type=>canvas.addEventListener(type,()=>drawing=false));canvas.parentElement.querySelector('.x-sigpad-clear').addEventListener('click',()=>ctx.clearRect(0,0,canvas.width,canvas.height))});
document.querySelectorAll('.x-voice-btn').forEach(button=>button.addEventListener('click',()=>{const active=button.classList.toggle('active');button.setAttribute('aria-pressed',active);button.parentElement.querySelector('.x-voice-status').textContent=active?'聞き取り中…':'タップして話す'}));
document.querySelectorAll('.x-dots').forEach(dots=>dots.querySelectorAll('button').forEach(dot=>dot.addEventListener('click',()=>{dots.querySelectorAll('button').forEach(item=>item.classList.remove('active'));dot.classList.add('active')})));
document.querySelectorAll('.x-mega-trigger').forEach(trigger=>trigger.addEventListener('click',()=>trigger.closest('.x-mega').classList.toggle('open')));
document.querySelectorAll('.x-scroll-tabs').forEach(tabs=>tabs.querySelectorAll('button').forEach(tab=>tab.addEventListener('click',()=>{tabs.querySelectorAll('button').forEach(item=>item.classList.remove('active'));tab.classList.add('active')})));
document.querySelectorAll('.x-heart-burst').forEach(button=>button.addEventListener('click',()=>{button.classList.add('burst');setTimeout(()=>button.classList.remove('burst'),200)}));
document.querySelectorAll('.x-confetti-trigger').forEach(trigger=>trigger.addEventListener('click',()=>{const layer=trigger.parentElement.querySelector('.x-confetti-layer');const colors=['#c4423f','#3b8b5c','#c58a2f','#3a6ea5'];for(let i=0;i<16;i++){const piece=document.createElement('i');piece.style.left=Math.random()*100+'%';piece.style.background=colors[i%colors.length];piece.classList.add('fall');layer.appendChild(piece);setTimeout(()=>piece.remove(),900)}}));
document.querySelectorAll('.x-swipe-stack').forEach(stack=>{const top=()=>stack.querySelector('.x-swipe-card:not(.gone)');const card=top();if(card)card.addEventListener('click',()=>card.classList.add('gone'))});
document.querySelectorAll('.x-locale-trigger').forEach(trigger=>trigger.addEventListener('click',()=>trigger.closest('.x-locale').classList.toggle('open')));
document.querySelectorAll('.x-locale-menu').forEach(menu=>menu.querySelectorAll('button').forEach(option=>option.addEventListener('click',()=>{menu.closest('.x-locale').querySelector('.x-locale-trigger').textContent='🌐 '+option.textContent;menu.closest('.x-locale').classList.remove('open')})));
document.querySelectorAll('.x-theme-toggle').forEach(button=>button.addEventListener('click',()=>{const active=button.classList.toggle('active');button.setAttribute('aria-pressed',active);button.querySelector('.x-theme-icon').textContent=active?'☾':'☀'}));
document.querySelectorAll('.x-live-counter').forEach(counter=>{const value=counter.querySelector('b');let count=Number(value.textContent.replace(/,/g,''));setInterval(()=>{count+=Math.floor(Math.random()*11)-5;count=Math.max(0,count);value.textContent=count.toLocaleString('en-US')},2500)});
document.querySelectorAll('.x-back-btn').forEach(button=>button.addEventListener('click',()=>{const original=button.textContent;button.textContent='戻っています…';setTimeout(()=>button.textContent=original,900)}));
document.querySelectorAll('.x-audio-play').forEach(button=>{const wave=button.parentElement.querySelector('.x-audio-wave');button.addEventListener('click',()=>{const playing=wave.classList.toggle('playing');button.textContent=playing?'❚❚':'▶'})});
