const Expense = require('../models/expense');

exports.getExpenses = (req,res,next)=>{
    Expense.findAll()
        .then(expenses=>{
            console.log('fetched');
            res.json(expenses)
        })
        .catch(err=>{
            console.log(err);
        })
};

exports.addExpense = (req,res,next)=>{
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    Expense.create({
        amount:amount,
        description:description,
        category : category
    }).then(result=>{
        console.log('inserted');
    }).catch(err=>{
        console.log(err);
    })
    res.json({amount,description,category});
}

exports.deleteExpense = (req,res,next)=>{
    try{
        if(req.params.id=='undefined'){
            console.log('ID missing');
            return res.status(400).json({err:'ID missing'});
        }
        const uId = req.params.id
        Expense.destroy({where: {id:uId}}).then(result=>{
            res.sendStatus(200);
        }).catch(err=>{
            console.log(err);
        });
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
    
}

exports.postEditExpense = (req,res,next)=>{
    try{
        if(req.params.id=='undefined'){
            console.log('ID missing');
            return res.status(400).json({err:'ID missing'});
        }
        const updatedAmount = req.body.amount;
        const updatedDescription = req.body.description;
        const updatedCategory = req.body.category;
        const expenseId = req.params.id
        Expense.findByPk(expenseId)
            .then(expense=>{
                expense.amount = updatedAmount;
                expense.description = updatedDescription;
                expense.category = updatedCategory
                return expense.save();
            })
            .then(result=>{
                console.log('Updated');
                res.sendStatus(200);
            }).catch(err=>{
                console.log(err);
            });
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};
