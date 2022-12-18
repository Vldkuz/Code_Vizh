const fs=require('fs');
let [,,Method,Input,Output,CodeWord,Alphabet]=[...process.argv];

if (!fs.existsSync(Input) || !fs.existsSync(Output))
{
    console.log("Неверный путь к файлам");
    return;
}

if ((Method=="encode" && CodeWord!=undefined && Alphabet!=undefined ) || (Method=="decode" && CodeWord!=undefined && Alphabet!=undefined))
{
    GetVizhCodeOrDecode(Alphabet,Input,Method,CodeWord,Output);    
    return;
}

if (Method=="decode")
{
    Alphabet=CodeWord;
    CodeWord=undefined;
}


if (Method=="decode" && CodeWord==undefined)
{
    let template=fs.readFileSync(Input,'utf-8');
    HackShifVizh(template,Alphabet);
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

function LoopShift(template,t)
{
    let LoopedStr = template.substring(template.length - t,template.length) + template.substring(0,template.length-t);
    return LoopedStr;
}

function HackShifVizh(template,keyLang)
{
    let i = 0;
    let Trigram=GetTriByKey(keyLang);
    let arr=[];
    while (i < template.length - 3)
    {
        let TempTrig=template.substring(i,i+3);
        let j=0;
        while (j < template.length - 3) {
            let Trig=template.substring(j,j+3)
            if (TempTrig==Trig && j!=i)
            {
                arr.push(Math.abs(i-j));
                break;
            }
            j++;
        }

        i++;
    }

    console.log(GetOftenDiv(arr));
}

function GetOftenDiv(arr)
{
    let n = arr.length, x = Math.abs(arr[0]);
    for (var i = 1; i < n; i++)
    { var y = Math.abs(arr[ i ]);
       while (x && y){ x > y ? x %= y : y %= x; }
       x += y;
    }
    return x;
}

function GetVizhCodeOrDecode(Alphabet,Input,Method,CodeWord,Output)
{
    let SpecSymb=[",",".","?","!"," ","-"];
    let Alp=GetAlphab(Alphabet);
    let Str=fs.readFileSync(Input,'utf-8');
    let Table=GetVizhTab(Alp);
    let ModuloRing=CodeWord.length;
    let Code=new String();
    for(let i = 0;i < Str.length;++i)
    {
        if (Method=="encode"){
            if (!(SpecSymb.includes(Str[i])))  Code+=Table[Str[i].toUpperCase()][CodeWord[i % ModuloRing].toUpperCase()];
            else Code+=Str[i];
        }
        else{
            if (!SpecSymb.includes(Str[i]))  
            {
                for (char of Alp)
                {
                    if (Table[CodeWord[i % ModuloRing].toUpperCase()][char]==Str[i].toUpperCase()) {
                        Code+=char
                        break;
                    }
                }
            }
            else Code+=Str[i];
        }
    }

    fs.writeFileSync(Output,Code);
}


function GetTriByKey(keyLang)
{
    if (keyLang=="en")
    {
        return ["the","hat","and","ion"]
    }
    else
    {
        return ["СТО","ЕНО","НОВ","ТОВ","ОВО","ОВА"];
    }

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