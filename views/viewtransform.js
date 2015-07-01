// INCLUDE AFTER client.js

// utilities for the viewport
View = {
  gx: 0,
  gy: 0,

  // dimensions of the view port in global space
  width: null,
  height: null,

  // The dimensions of the projection space, in pixels
  projWidth: null,
  projHeight: null
};

// global to local coords
View.g2l = function(x, y) {
  return {
    x: (x - View.gx) * View.projWidth / View.width,
    y: (y - View.gy) * View.projHeight / View.height
    };
};

View.g2l_batch = function(nodes) {
  for(i = 0; i < nodes.length; i++) {
    lxy = View.g2l(nodes[i].gx, nodes[i].gy);
    nodes[i].lx = lxy.x;
    nodes[i].ly = lxy.y;
  }
};

// local to global coords
View.l2g = function(x, y) {
  return {
    x: (x + View.gx) * View.width / View.projWidth,
    y: (y + View.gy) * View.height / View.projHeight
    };
};

View.l2g_batch = function(nodes) {
  for(i = 0; i < nodes.length; i++) {
    gxy = View.l2g(nodes[i].lx, nodes[i].ly);
    nodes[i].gx = gxy.x;
    nodes[i].gy = gxy.y;
  }
};

View.init = function(gx, gy, width, height, projWidth, projHeight) {
  View.gx = gx;
  View.gy = gy;
  View.width = width;
  View.height = height;
  View.projWidth = projWidth;
  View.projHeight = projHeight;
};
