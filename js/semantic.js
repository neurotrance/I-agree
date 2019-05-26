let verbStart = ['make','know','think','take','see','want','find','give','try','begin','hear','believe','bring','happen','write','provide','sit','include','continue','learn','follow','create','speak','read','allow','add','spend','grow','remember','appear','remain','suggest','raise','require','decide','pull','explain','develop','carry','receive','join','agree','teach','describe','choose','listen','realize','involve','seek','represent','protect','occur','accept','identify','enjoy','reflect','deliver','observe','emerge','remind'];
let adjStart = ['new','old','great','big','small','large','national','young','different','important','real','social','able','local','possible','true','full','special','recent','certain','personal','red','natural','significant','similar','central','happy','ready','simple','various','entire','nice','huge','popular','wide','specific','beautiful','heavy','modern','interesting','fresh','effective','original','powerful','perfect','normal','previous','bright','additional','soft','wonderful','aware','sweet','empty','obvious','comfortable','thick','unique','internal','golden'];
let nounStart = ['time','year','people','day','world','student','country','week','company','system','night','water','room','area','money','story','fact','month','lot','job','business','friend','hour','car','city','idea','body','information','office','door','person','art','morning','food','moment','air','teacher','music','role','voice','road','difference','action','season','situation','data','news','movie','attention','tree','window','energy','summer','choice','material','behavior','goal','treatment','size','reaction'];
let verbs = [];
let adjectives = [];
let nouns = [];
let partLists = [verbs,adjectives,nouns];
let pairsCongr = [];
let pairsIncongr = [];



class Word {
    constructor(word, partOfSpeech) {
        this.word = word;
        this.pOS = partOfSpeech;
    }
}
class Pair {
    constructor(word1, word2, type) {
        this.one = word1;
        this.two = word2;
        this.type = type;
    }
}

//make arrays of word/part of speech objects
verbStart.forEach(function(verb) {verbs.push(new Word(verb, 'verb'))});
adjStart.forEach(function(adj) {adjectives.push(new Word(adj, 'adj'))});
nounStart.forEach(function(noun) {nouns.push(new Word(noun, 'noun'))});
verbStart = [];
adjStart = [];
nounStart = [];

//make congruent pair list
partLists.forEach(function(list) {
    list.forEach(function(word1, i) {
        for (let n = i + 1; n < list.length; n++) {
            pairsCongr.push(new Pair(word1, list[n], 'congruent'));
        }
    });
});

//make incongruent pair list
verbs.forEach(function(verb) {
    nouns.forEach(function(noun) {pairsIncongr.push(new Pair(verb, noun, 'incongruent'))});
});

verbs.forEach(function(verb) {
    adjectives.forEach(function(adj) {pairsIncongr.push(new Pair(verb, adj, 'incongruent'))});
});

nouns.forEach(function(noun) {
    adjectives.forEach(function(adj) {pairsIncongr.push(new Pair(noun, adj, 'incongruent'))});
});



//partLists.forEach(function(part) {part = [];});

/* function check() {
    console.log(pairsCongr);
    console.log(pairsIncongr);
    console.log(verbStart,adjStart,nounStart,verbs,adjectives,nouns);
} */