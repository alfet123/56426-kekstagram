function getMessage(a, b) {
  var result = '';

  switch(typeof a) { 
    case 'boolean':    
      result += (a) ? 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров' : 'Переданное GIF-изображение не анимировано';
      break;
    case 'number':  
      result += 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' аттрибутов';
      break;
    case 'object':
      if (Array.isArray(a)) {
        if (Array.isArray(b)) {
          var square = 0;
          for (i = 0; i < a.length; i++) {
            square += a[i] * b[i];
          }
          result += 'Общая площадь артефактов сжатия: ' + square + ' пикселей';
        }
        else {
          var sum = 0;
          for (i = 0; i < a.length; i++) {
            sum += a[i];
          }
          result += 'Количество красных точек во всех строчках изображения: ' + sum;
        }
      }
  }

  return result;
}
