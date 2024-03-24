class Point {
    constructor(x, y) {
        this.x = x || 0; 
        this.y = y || 0;
    }

    diff(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    sum(point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}