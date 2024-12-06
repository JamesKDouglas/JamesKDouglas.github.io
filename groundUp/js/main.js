

function Waterfall(id, width, height) {
  // Assume a 50px margin around the waterfall display
  this.margin = 50;

  this.width = width == null ? 400 : width;
  this.height = height == null ? 400 : height;
  this.elementWidth = null;
  this.elementHeight = null;

  this.data = null;

  this.x = null;
  this.y = null;
  this.z = d3.scaleSequential(d3.interpolateViridis);


  this.div = d3.select(id);

  this.canvas = this.div.append("canvas");

  this.svg = this.div.append("svg");
  this.svgGroup = this.svg.append("g");
  this.rectangle = this.svgGroup.append("rect");
  this.xAxis = null;
  this.yAxis = null;
  this.xAxisGroup = this.svgGroup.append("g");
  this.yAxisGroup = this.svgGroup.append("g");
  this.xAxisLabel = this.svgGroup.append("text");
  this.yAxisLabel = this.svgGroup.append("text");
  this.tooltipGroup = this.svgGroup.append("g");
}

// cb = callback
function getData(w, cb) {
  d3.buffer('https://d3-spectrogram.vicgonzalez25.repl.co/data.dat').then((data) => {
      w.data = getSpectrogramData(data, 2);
      if (cb) cb(w);
  })
}

function getSpectrogramData(data, m) {
  let spectrogram_data = [];
  const packet_size = 2069;
  const total_packets = (data.byteLength / packet_size) | 0; 
  let timestamp_now = new Date(Date.now()); 

  /** Calculate the frequencies **/

  let fs = 120e6;
  let nfft = 1024;
  let step_freq = fs / ( nfft * m );

  /** Ranges **/

  let freqRange = [0, step_freq * (512 - 1)];
  let timeRange = [+timestamp_now];
  let dbRange = [0, Math.pow(2, 32) - 1];

  /** Read the histogram data **/

  let slice_offset = 0;
  for (let i = 0; i < total_packets; i++) {
      let pkt = data.slice(slice_offset, slice_offset + packet_size);
      let met_seconds_8array = new Uint8Array(pkt.slice(4, 7));
      let met_seconds = (met_seconds_8array[2] << 16) | (met_seconds_8array[1] << 8) | met_seconds_8array[0];

      let histogram_32array = new Uint32Array(pkt.slice(19, 2067));
      timestamp_now.setSeconds(timestamp_now.getSeconds() + met_seconds);

      let histogram_data = []

      for (let i = 0; i < 512; i++) {
          histogram_data.push({
              'freq': step_freq * i,
              'dB': histogram_32array[i]
          });
      }

      spectrogram_data.push({
          'values': histogram_data,
          'dateTime': +timestamp_now
      })

      slice_offset += packet_size;
  }

  timeRange.push(+timestamp_now);

  return {
      'dbRange': dbRange,
      'freqRange': freqRange,
      'freqStep': step_freq,
      'timeRange': timeRange.reverse(),
      'values': spectrogram_data
  };
}

function formatFrequency(n) {
  return d3.format(".3s")(n) + "Hz";
}

function initDisplay(w) {

  let width = w.width - 5,
      height = w.height - 15,
      elementWidth = width - 2 * w.margin,
      elementHeight = height - 2 * w.margin;

  w.elementWidth = elementWidth;
  w.elementHeight = elementHeight;

  w.svg.attr("width", width)
      .attr("height", height)
      .style("position", "absolute");
  w.svgGroup.attr("transform", "translate(" + w.margin + "," + w.margin + ")");

  w.x = d3.scaleLinear().range([0, elementWidth]).interpolate(d3.interpolateRound);
  w.y = d3.scaleTime().range([0, elementHeight]).interpolate(d3.interpolateRound);

  w.pixelHeight = d3.scaleLinear().range([0, 100]).interpolate(d3.interpolateRound);
  w.pixelHeight.domain(w.data.freqRange);

  w.x.domain(w.data.freqRange);
  w.y.domain(w.data.timeRange);
  w.z.domain(w.data.dbRange);

  w.canvas.attr("width", elementWidth)
      .attr("height", elementHeight)
      .style("padding", w.margin + "px")
      .style("position", "absolute");
  w.rectangle.attr("width", elementWidth)
      .attr("height", elementHeight)
      .style("fill", "#fff")
      .style("opacity", 0);

  w.xAxis = d3.axisTop(w.x).ticks(16).tickFormat(formatFrequency);
  w.xAxisGroup.attr("class", "axis x-axis")
      .call(w.xAxis);
  w.yAxis = d3.axisLeft(w.y);
  w.yAxisGroup.attr("class", "axis y-axis")
      .call(w.yAxis);

  w.xAxisLabel.attr("class", "axis x-axis")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + elementWidth / 2 + "," + -w.margin / 2 + ")")
      .text("Frequency");
  w.yAxisLabel.attr("class", "axis y-axis")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + -w.margin / 2 + "," + (w.margin / 4) + ")")
      .text("Time");

  renderDisplay(w);
}

function renderDisplay(w) {
  let context = w.canvas.node().getContext("2d");
  
  let pHeight = Math.ceil(w.elementHeight / w.data.values.length);

  for (let i = 0; i < w.data.values.length; i++) {
      for (let j = 0; j < w.data.values[i].values.length; j++) {
          context.fillStyle = w.z(w.data.values[i].values[j].dB);
          context.fillRect(w.x(w.data.values[i].values[j].freq),
              w.y(w.data.values[i].dateTime),
              w.x(w.data.values[i].values[j].freq + w.data.freqStep) - w.x(w.data.values[i].values[j].freq),
              pHeight)
      }
  }
}

var w = new Waterfall("#waterfall", 900, 400);
getData(w, initDisplay);