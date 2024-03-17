class APIFeatures { //không query trực tiếp trong class
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        //1A.Filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        //remove các field để query không lỗi
        excludedFields.forEach(el => delete queryObj[el]); //delete in JS: an operator, remove a property from an obj


        //1B. Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        //2. Sorting: nếu sort=tên_field thì sort tăng dần, -tên_field thì sort giảm dần
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' '); //join các sort field
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort({ price: 'desc' });//default sort theo createdAt DESC
            //c2. query = query.sort('-price'); //desc
            //c3. query = query.sort({price: -1}); //desc
        }

        return this;
    }

    limit() {
        //3. Received Fields limiting 
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');//exculde __v from output
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 20;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;