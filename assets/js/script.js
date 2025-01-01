const calcGame = new CalcGame();
        
function CalcGame(){
    const getRandomNum = (mn, mx) => Math.floor(Math.random() * (mx - mn + 1)) + mn;
    // const nums = '1234567890';  
    const nums = '123456789';    //일단 0 뺌
    const oprs = '+-*/';


    this.obj = {
        state: '',
        raf: '',
        numCnt: 0,
        combiNum: '',
        numGroupArr: [],
        finalVal: undefined,
        recalCnt: 0
    }

    this.getNumber = () => {
        this.obj.combiNum = '';
        for(let i = 0; i < this.obj.numCnt; i++){
            this.obj.combiNum += nums[getRandomNum(0, nums.length - 1)];
        }
    }

    this.setGroup = () => {
        this.obj.numGroupArr = [];

        while(this.obj.combiNum.length){
            const cutLen = getRandomNum(1, 3);
            this.obj.numGroupArr.push(this.obj.combiNum.slice(0, cutLen));
            this.obj.combiNum = this.obj.combiNum.slice(cutLen);
        }
    }

    this.checkValidNum = () => {    //0이 있을 경우(지금은 0이 없음)
        this.obj.numGroupArr.forEach((num, idx) => {
            if(num !== String(+num)){
                console.log(`${idx}의 경우 0이 맨 앞에 존재`);
            }
        })
    }

    this.calc = (a, b, opr) => {
        let calced;
        if(opr === '+') calced = a + b;
        else if(opr === '-') calced = a - b;
        else if(opr === '*') calced = a * b;
        else if(opr === '/') calced = a / b

        return calced; 
    }

    this.randomOprCalc = () => {
        this.obj.finalVal = this.obj.numGroupArr.reduce((accumulator, currentValue) => {
            const opr = oprs[getRandomNum(0, oprs.length - 1)];
            // return accumulator + currentValue;

            if(opr === '+') return +accumulator + +currentValue;
            else if(opr === '-') return +accumulator - +currentValue;
            else if(opr === '*') return +accumulator * +currentValue;
            else if(opr === '/') return +accumulator / +currentValue;

        });

        if(String(this.obj.finalVal).indexOf('.') > -1){
            console.warn('재연산!!!');
            const recalCnt = document.getElementById('recalCnt');

            this.obj.recalCnt++;
            recalCnt.textContent = this.obj.recalCnt;
            this.randomOprCalc();
        }
    }

    

    

    this.shuffleArr = (arr) => {
        //Fisher-Yates Shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // 0부터 i까지 랜덤한 인덱스
            [arr[i], arr[j]] = [arr[j], arr[i]];  // swap
        }
        return arr;
    }

    this.setNumList = () => {  //ui
        const shffArr = this.shuffleArr(this.obj.numGroupArr.join('').split(''));
        const numList = document.getElementById('numList');
        numList.innerHTML = '';

        shffArr.forEach((num) => {
            const li = document.createElement('li');
            li.textContent = num;
            li.dataset.id = num;
            li.dataset.type = 'num';

            li.addEventListener('click', (e) => {
                const calcBoard = document.getElementById('calcBoard');
                const numList = document.getElementById('numList');

                if(e.target.closest('#numList')){
                    calcBoard.appendChild(e.currentTarget);
                }else{
                    // if(calcBoard.querySelectorAll('li').length > 1 && calcBoard.querySelectorAll('li')[1].dataset.type === 'opr'){
                    //     alert('잘못된 요청입니다.');
                    //     return;
                    // }
                    
                    numList.appendChild(e.currentTarget);
                }
            })

            numList.appendChild(li);
        })
    }

    this.bindFnc = () => {
        document.querySelectorAll('[data-type="opr"]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const calcBoard = document.getElementById('calcBoard');
                const numList = document.getElementById('numList');
                const calcList = calcBoard.querySelectorAll('li');
                
                // if(!calcList.length
                // || calcList[calcList.length - 1].dataset.type === 'opr'
                // || !numList.querySelectorAll('li').length
                // ){
                //     alert('잘못된 요청입니다.');
                //     return;
                // }
                const copy = e.currentTarget.cloneNode(true);
                copy.addEventListener('click', e => {
                    e.currentTarget.remove();
                })
                calcBoard.appendChild(copy);
            })

        })
        
        document.getElementById('submit').addEventListener('click', () => {
            const calcBoard = document.getElementById('calcBoard');
            const numList = document.getElementById('numList');

            if(numList.querySelectorAll('li').length){
                alert('모든 숫자를 사용해주세요.');
                return;
            }

            let oprCnt = 0;
            let overOpr = false;

            calcBoard.querySelectorAll('li').forEach(li => {
                if(li.dataset.type === 'opr') oprCnt++;
                else oprCnt = 0;

                if(oprCnt > 1) overOpr = true;
            })

            if(overOpr){
                alert('연산자를 확인해 주세요.');
                return;
            }

            if(calcBoard.querySelectorAll('li')[0].dataset.type === 'opr'){
                alert('맨 앞에 연산자가 올 수 없습니다.');
                return;
            }


            let anyOpr = false;
            for(let i = 0; i < calcBoard.querySelectorAll('li').length; i++){
                if(calcBoard.querySelectorAll('li')[i].dataset.type === 'opr'){
                    anyOpr = true;
                    break;
                }
            }

            if(!anyOpr){
                alert('연산자가 빠졌습니다.');
                return;
            }


            let calcBoardStr = '';
            document.querySelectorAll('#calcBoard li').forEach(li => {
                calcBoardStr += li.dataset.id;
            });
            try{
                const result = new Function('return ' + calcBoardStr)();  // new Function을 사용하여 문자열 계산
                // console.log(result);  // 결과: -3
    
                const myVal = document.getElementById('myValue');
    
                myVal.textContent = result;
                myVal.setAttribute('class', 'my-value');
    
                if(this.obj.finalVal === result) myVal.classList.add('correct');
                else myVal.classList.add('wrong');

            }catch(err){
                alert('식을 확인해주세요.');

            }
        });
        document.getElementById('init').addEventListener('click', () => {
            if(!confirm('초기화하시겠습니까?')) return;

            const myVal = document.getElementById('myValue');
            document.getElementById('myValue').innerHTML = '';
            myVal.setAttribute('class', 'my-value');

            document.querySelectorAll('#calcBoard li[data-type="opr"]').forEach(li => {
                li.click();
            })
            document.querySelectorAll('#calcBoard li').forEach((li, idx) => {
                li.click();
            })
        });
    }

    this.setFinalNum = () => {
        document.getElementById('finalValue').textContent = this.obj.finalVal;
    }

    this.gameStart = () => {
        this.obj.state = 'start';
        this.obj.numCnt = getRandomNum(5, 10);


        this.getNumber();
        this.setGroup();
        this.checkValidNum();
        this.randomOprCalc();
        

        this.setFinalNum(); //ui
        this.setNumList();  //ui
        this.bindFnc(); //ui(click함수 바인딩)
    }

    this.gameStart();
}