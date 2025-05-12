class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 10
        const skip = (page - 1) * limit
        this.length = this.query.length
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

module.exports = APIfeatures