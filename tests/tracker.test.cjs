const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]).join('\n');
const elements = new Map();
function element(id) {
    if (!elements.has(id)) elements.set(id, {value: '', innerText: '', innerHTML: ''});
    return elements.get(id);
}
let alerts = 0;
const context = vm.createContext({
    document: {getElementById: element, documentElement: {setAttribute(){}, getAttribute(){return 'light';}}},
    localStorage: {getItem(){return null;}, setItem(){}},
    window: {scrollTo(){}},
    alert(){alerts++;},
    confirm(){return true;},
});
vm.runInContext(source, context);
assert.equal(vm.runInContext('formatTime(1.999)', context), '2h 0m (2.00)');

const now = new Date();
const monday = new Date(now);
monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
monday.setHours(0, 0, 0, 0);
const nextMonday = new Date(monday);
nextMonday.setDate(nextMonday.getDate() + 7);
const dateText = date => [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
context.fixture = [{date:dateText(monday),hours:2,tips:10},{date:dateText(nextMonday),hours:8,tips:99}];
element('monthSelector').value = dateText(monday).slice(0,7);
vm.runInContext('shifts = fixture; updateUI();', context);
assert.equal(element('weekTips').innerText, '€10.00');

element('date').value = dateText(now);
element('h_part').value = '1';
element('m_part').value = '60';
element('tips').value = '5';
element('editIndex').value = '-1';
vm.runInContext('handleEntry()', context);
assert.equal(alerts, 1);
assert.equal(vm.runInContext('shifts.length', context), 2);
element('m_part').value = '30';
vm.runInContext('handleEntry()', context);
assert.equal(vm.runInContext('shifts.length', context), 3);
console.log('Tracker regression checks passed');
