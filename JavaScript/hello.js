console.log("Hello, World!");

const num_1 = 5;
const num_2 = 3;

let sum = num_1 + num_2;
let difference = num_1 - num_2;


console.log(sum + difference);

function greet(name){
    console.log("Hello, " + name + "!");
}
greet("Hikaru");




function checkTemperature(t){
    if(t >= 30) {
        console.log("Hot")
    } else if(t >= 15) {
        console.log("Warm")
    } else {
        console.log("Cold")
    }
}

function checkOddOrEven(n){
    if(n % 2 === 0) {
        console.log("Even");
    } else {
        console.log("Odd");
    }
}




// function hasOdd(numbers) {
//     while (nembers === false) {
//         console.log("false");
//         if (numbers % 2 === 1){
//             console.log("true");
//         }
//     }
// } 

function hasOdd(numbers) {
    for(const num of numbers) {
        if(num % 2 !== 0) {
        return true;}         
    }
    return false;
}

function odd(numbers) {
    const result = [];
    for(const num of numbers) {
        if(num % 2 !== 0) {
            result.push(num);
        }    
    } return result;
}

function square(numbers) {
    const result = []
    for(const num of numbers) {
        result.push(num * num)
    } return result;
}



// ーーーーーーーーーーーここからオブジェクトーーーーーーー



const books = [
  { name: 'JavaScript入門', author: '山田太郎' },
  { name: 'JavaScriptの絵本', author: '山田次郎' }
];

function printBooks(books) {
    for(const book of books) {
        console.log(`『${book.name}』 ${book.author}`);
    }
    
}

const users = [
    {
        username: '山田',
        permissions: {
            canRead:true,
            canWrite:true,
            canDelete:false
        }
    },
    {
       username: '佐藤',
        permissions: {
            canRead:false,
            canWrite:true,
            canDelete:false
        } 
    }
]

function checkPermission(username,permission) {
    for(const user of users) {
        if(user.username === username){
            return user.permissions[permission];
        }
    }
}
