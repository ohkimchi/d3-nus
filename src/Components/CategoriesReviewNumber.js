import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { parseDate } from '../store/action';
import SimpleCategoryInDialog from './SimpleCategoryInDialog';


const width = 500;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };
const red = '#eb6a5b';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const CategoriesReviewNumber = (props) => {
  const { data, numMax } = props
  const { key, values } = data
  const [svgPath, setSvgPath] = useState("")
  const [open, setOpen] = useState(false);

  const xAxisRef = useRef()
  const yAxisRef = useRef()

  let xScale = d3.scaleTime().range([margin.left, width - margin.right])
  let yScale = d3.scaleLinear().range([height - margin.bottom, margin.top])

  let lineGenerator = d3.line()
  let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%b'))
  let yAxis = d3.axisLeft().scale(yScale);

  useEffect(() => {
    const timeDomain = d3.extent(values, d => parseDate(d.key));
    xScale.domain(timeDomain);
    yScale.domain([0, numMax]);
    lineGenerator.x(d => xScale(parseDate(d.key)));
    lineGenerator.y(d => yScale(d.value));
    const pathSvg = lineGenerator(values)

    setSvgPath(pathSvg)
    d3.select(xAxisRef.current).call(xAxis)
    d3.select(yAxisRef.current).call(yAxis)

  }, [numMax])


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="SVGBlock">
        <svg width={width} height={height}>
          <path d={svgPath} fill='none' stroke={red} strokeWidth='2' />
          <g>
            <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
            <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
          </g>
        </svg>

        <div>
          <h5>{key}</h5>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Open Zoomed Graph for {key}
          </Button>
        </div>
      </div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Trend Graph for {key}
        </DialogTitle>
        <DialogContent dividers>
          <SimpleCategoryInDialog data={data} numMax={numMax} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoriesReviewNumber
