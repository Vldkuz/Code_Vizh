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

    let key_var = GetOftenDiv(arr);
    let mas_used = new Array();
    let max = 0;
    let min = template.length
    let char;

    for (len of key_var.entries())
    {
        if (len[1] > max && len[0] < min) 
        {
            max=len[1];
            min=len[0]
            char=len[0];
        }
    }

    let freq=new Map();
    if (keyLang==en){
        let alph=["E","T","A","O","I","N","S","H","R","D","L","C","U","M","W","F","G","Y","P","B","V","K","X","J","Q","Z"];
        let TabF=[0.127, 0.096, 0.0817, 0.0751 , 0.0697, 0.0675, 0.0633, 0.0609	, 0.0599 , 0.0425, 0.0403 , 0.0278 , 0.0276, 0.0241, 0.0236 , 0.0223, 0.0202, 0.0197, 0.0193, 0.0149, 0.0098, 0.0077, 0.0015, 0.0015, 0.001, 0.0005];
        for (let i = 0; i < alph.length; ++i)
        {
            freq.get(alph[i],TabF[i]);
        }
    }
    else{
        
        let alph=["О","Е","А","И","Н","Т","С","Р","В","Л","К","М","Д","П","У","Я","Ы","Ь","Г","З","Б","Ч","Й","Х","Ж","Ш","Ю","Ц","Щ","Э","Ф","Ъ","Ё"];
        let TabF=[0.10983, 0.08483, 0.07998, 0.07367 , 0.067, 0.06318, 0.05473, 0.04746	, 0.04533 , 0.04343 , 0.03486 , 0.03203 , 0.02977, 0.02804, 0.02615 , 0.02001, 0.01898, 0.01735, 0.01687 , 0.01641, 0.01592 , 0.0145, 0.01208, 0.00966, 0.0094, 0.00718, 0.00639, 0.00486, 0.00361, 0.00331, 0.00267, 0.00037, 0.00013];
        for (let i = 0; i < alph.length; ++i)
        {
            freq.get(alph[i],TabF[i]);
        }
    }

    let SymbFreq=new Map();
    for (let i = 0; i < char ; i++) {
        SymbFreq.set(template[i] , 0);
        for (let j  = 0; j < template.length; j++)
        {
            if (Symb==template[j])
            {
                SymbFreq.set(template[j],SymbFreq.get(template[j])+1);
            }
        }
    }

    for (temp of SymbFreq.entries())
    {
        

    }






}


function GetGroup(t,period,template)
{
    let Str="";
    let i = t;
    while (i < template.length)
    {
        Str+=template[i]
        i+=period;
    }
    return Str;
}
function GetOftenDiv(arr)
{
    let div=new Map();
    for (let i = 0 ; i < arr.length - 1; ++i)
    {
        for (let j = i + 1;j < arr.length; ++j)
        {
            let temp=Nod(arr[i],arr[j])
            if (arr[i]!=arr[j] && temp!=1)
            {
                if (div.get(temp))
                {
                    div.set(temp,div.get(temp)+1);
                }
                else
                {
                    div.set(temp,1);
                }
            }
        }
    }
    return div;
}

function Nod(a,b)
{
    while (a!=0 && b!=0)
    {
        if (a>b)
        {
            a = a % b;
        }
        else{
            b = b % a;
        }
    }

    return a+b;
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