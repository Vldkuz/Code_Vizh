const { count } = require('console');
const fs=require('fs');
let [,,Method,Input,Output,CodeWord,Alphabet]=[...process.argv];

if (!fs.existsSync(Input) || !fs.existsSync(Output))
{
    console.log("Неверный путь к файлам");
    return;
}

if ((Method=="encode" && CodeWord!=undefined && Alphabet!=undefined ) || (Method=="decode" && CodeWord!=undefined && Alphabet!=undefined))
{
    let Alp=GetAlphab(Alphabet);
    let Str=fs.readFileSync(Input,'utf-8');
    let Table=GetVizhTab(Alp);
    let ModuloRing=CodeWord.length;
    let Code=new String();
    for(let i = 0;i < Str.length;++i)
    {
        if (Method=="encode"){
            if (Str[i]!=" ")  Code+=Table[Str[i].toUpperCase()][CodeWord[i % ModuloRing].toUpperCase()];
            else Code+=" ";
        }
        else{
            if (Str[i]!=" ") 
            {
                for (char of Alp)
                {
                    if (Table[CodeWord[i % ModuloRing].toUpperCase()][char]==Str[i].toUpperCase()) {
                        Code+=char
                        break;
                    }
                }
            }
            else Code+=" ";
        }
    }

    fs.writeFileSync(Output,Code);
    return;
}

if (Method=="decode")
{
    Alphabet=CodeWord;
    CodeWord=undefined;
}


if (Method=="decode" && CodeWord==undefined)
{
    let str=fs.readFileSync(Input,'utf-8');
    let t = 2;
    let LenKey=0;
    while (t < str.length)
    {
        let IndexT=GetIndexSovp(GetPosT(str,t));
        if (Math.max(IndexT))
        {
            LenKey=t;
            break;
        }
        t++;
    }

    let CodeWord=GetSubstr(str,0,LenKey);

}
else 
{
    console.log("Не указано кодовое слово");
    return;
}

if (!Alphabet.includes("ru") && !Alphabet.includes("en"))
{
    console.log("Не указан алфавит");
    return;
}

if (Method!="decode" && Method!="encode")
{
    console.log("Не правильно указан метод");
    return;
}

function GetPosT(str,t)
{
    let temp = 0;
    let pos=new String();
    while (temp < str.length)
    {
        pos+=str[temp];
        temp+=t;
    }
    return pos;
}

function GetSubstr(str,start,end)
{
    let Substr=new String();
    for (let i = start; i < end; i++) {
        if (str[i]!=" ") Substr+=str[i];
        else{
            end+=1;
        }
    }
    return Substr;
}

function GetVizhTab(Alp)
{
    let Table=new Array();

    for (let char of Alp) {
        Table[char]=new Array();
    }

    for (let char2 of Alp)
    {
        Table[Alp[0]][char2] = char2;
    }


    for (let i = 1; i < Alp.length; ++i) {
        for (let j = 0;j < Alp.length;++j)
        {
            Table[Alp[i]][Alp[j]]=Table[Alp[i-1]][Alp[(j+1) % Alp.length]];
        }
    }
    return Table;
}


function GetAlphab(key)
{
    let Alp=new Array();
    if (key=="en")
    {
        for (let i = 65; i < 91 ; ++i) {
            Alp.push(String.fromCharCode(i));
        }
    }
    else
    {
        for (let i = 1040; i < 1072 ; ++i) {
            Alp.push(String.fromCharCode(i));
        }
    }

    Alp.push(",",".","-","!","?");
    return Alp;
}


function GetIndexSovp(Str)
{
    let Frequency=GetFrequency(Str);
    let IndexSovp=0;
    for(let i = 0;i < Str.length; ++i)
    {
        IndexSovp+=(Frequency.get(Str[i]))**2;
    }
    IndexSovp=(IndexSovp/(Str.length**2));
    return IndexSovp;
}

function GetFrequency(Str)
{
    let Frequency = new Map();
    for(char of Str)
    {
        Frequency.get(char) ? Frequency.set(char,Frequency.get(char)+1) : Frequency.set(char,1);
    }
    return Frequency;
}