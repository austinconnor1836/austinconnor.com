const state = {
  top: 0,
  pages: 0,
  threshold: 4,
  mouse: [0, 0],
  content: [
    {
      tag: '00',
      text: `hello\nI'm Austin`,
      images: ['/images/BH41NVu.jpg', '/images/fBoIJLX.jpg', '/images/04zTfWB.jpg'],
    },
    { tag: '01', text: `I'm a\nsoftware developer`, images: ['/images/c4cA8UN.jpg', '/images/ajQ73ol.jpg', '/images/gZOmLNU.jpg'] },
    { tag: '02', text: `and a cloud architect.`, images: ['/images/mbFIW1b.jpg', '/images/mlDUVig.jpg', '/images/gwuZrgo.jpg'] },
  ],
  depthbox: [
    {
      depth: 0,
      color: '#cccccc',
      textColor: '#ffffff',
      // text: 'In a void,\nno one could say\nwhy a thing\nonce set in motion\nshould stop anywhere.',
      text: 'Give me a fulcrum,\nand I shall move the world!\n- Archimedes',
      image: '/images/cAKwexj.jpg',
    },
    {
      depth: -5,
      textColor: '#272727',
      // text: 'For why should it stop\nhere rather than here?\nSo that a thing\nwill either be at rest\nor must be moved\nad infinitum.',
      text: 'Hope without action guarantees the endurance of the inequities of today.',
      image: '/images/04zTfWB.jpg',
    },
  ],
  lines: [
    { points: [[-20, 0, 0], [-9, 0, 0]], color: "black", lineWidth: 0.5 },
    { points: [[20, 0, 0], [9, 0, 0]], color: "black", lineWidth: 0.5 },
  ]
}

export default state
