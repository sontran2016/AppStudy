using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace GaugeBoard
{
    /// <summary>
    /// Interaction logic for ctrLinear.xaml
    /// </summary>
    public partial class CtrLinear : UserControl
    {
        private const double margin = 20;
        private LinearModel linearModel;
        private double _height;        
        private Polygon objCursor;
        private TextBlock objValue;
        private Rectangle objFilter;

        private class LinearModel
        {
            public double CurrentValue { get; set; }
            public double Min { get; set; }
            public double Max { get; set; }
            public double Width { get; set; }
            public double Height { get; set; }
            public List<RangeModel> RangeModel { get; set; }
        }
        public class RangeModel
        {
            public double From { get; set; }
            public double To { get; set; }
            public Brush Brush { get; set; }
        }
        public CtrLinear()
        {
            InitializeComponent();
            linearModel = new LinearModel() {CurrentValue=4.5, Min = 0, Max = 100, Width = 20, Height = 200 };
            var rangeModel = new List<RangeModel>();
            rangeModel.Add(new RangeModel { From = 0, To = 50, Brush = Brushes.Green });
            rangeModel.Add(new RangeModel { From = 50, To = 100, Brush = Brushes.Red });
            //rangeModel.Add(new RangeModel { From = 80, To = 100, Brush = Brushes.Crimson });
            linearModel.RangeModel = rangeModel;
            DrawLinear();
        }

        public double RangeValue
        {
            get { return linearModel.RangeModel.First().To; }
            set
            {
                linearModel.RangeModel.First().To = value;
                linearModel.RangeModel.Last().From = value;
                DrawLinear();
            }
        }
        //public List<RangeModel> Ranges
        //{
        //    get { return linearModel.RangeModel; }
        //    set { linearModel.RangeModel = value; }
        //}

        public double MinValue
        {
            get { return linearModel.Min; }
            set
            {
                linearModel.Min = value;
                DrawLinear();
            }
        }
        public double MaxValue
        {
            get { return linearModel.Max; }
            set
            {
                linearModel.Max = value;
                DrawLinear();
            }
        }
        public double CurrentValue
        {
            get { return linearModel.CurrentValue; }
            set
            {
                if (value >= linearModel.Min && value <= linearModel.Max && linearModel.CurrentValue != value)
                {
                    linearModel.CurrentValue = value;
                    DrawCursor(linearModel.CurrentValue, margin + 30, margin);
                    var x1 = margin + 30 + linearModel.Width + linearModel.Width / 2;
                    DrawRectangleFilter(linearModel.CurrentValue, x1, margin);
                }
            }
        }

        public double ControlHeight
        {
            get { return _height; }
            set
            {
                _height = value;                        
                panelLinear.Height = value;
                if (linearModel != null)
                {
                    var h = value - 2 * margin-10;
                    if (h > 0)
                    {
                        linearModel.Height = h;
                        DrawLinear();
                    }
                }
            }
        }

        private void UserControl_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            if (linearModel != null)
            {
                ControlHeight= this.ActualHeight;
            }
        }
        private void DrawLinear()//Vertical
        {
            double marginLeft = margin + 30;

            panelLinear.Children.Clear();
            DrawLine(0, 0, 0, linearModel.Height, Brushes.Black, marginLeft, margin);
            double majorLen = 10*linearModel.Height / linearModel.Max;
            double minorLen = majorLen / 4;
            double x1 = 0, x2 = linearModel.Width;
            double y1 = 0, y2 = 0;
            for (double i = 0; i <= linearModel.Max; i+=10)
            {
                DrawLine(x1, y1, x2, y2, Brushes.Red, marginLeft, margin);
                if (i < linearModel.Max)
                {
                    for (int j = 1; j < 4; j++)
                    {
                        DrawLine(x1, y1 + minorLen * j, x2 / 2, y2 + minorLen * j, Brushes.Black, marginLeft, margin);
                    }
                }
                DrawText((linearModel.Max - i).ToString(), margin, y1 + margin - 8, FontWeights.Normal, 12.0, Brushes.Black);
                y1 = y2 = y1 + majorLen;
            }
            x1 = marginLeft + linearModel.Width + linearModel.Width / 2;
            DrawRectangle(linearModel.CurrentValue, x1, margin);
            DrawCursor(linearModel.CurrentValue, marginLeft, margin);
            DrawRange(linearModel, marginLeft, margin);
        }

        private void DrawRange(LinearModel _linearModel, double marginLeft, double marginTop)
        {
            if (_linearModel.RangeModel == null)
                return;
            PointCollection points = new PointCollection();
            double dx;
            double tang = (_linearModel.Width / 2) / _linearModel.Height;
            dx = _linearModel.Height / _linearModel.Max;
            foreach (var r in _linearModel.RangeModel)
            {
                double dx1, dx2, hi1, hi2;
                points.Clear();
                hi1 = (_linearModel.Max - r.From) * dx;
                dx1 = tang * hi1;
                hi2 = (_linearModel.Max - r.To) * dx;
                dx2 = tang * hi2;
                points.Add(new Point(0, (_linearModel.Max - r.From) * dx));
                points.Add(new Point(_linearModel.Width - dx1, (_linearModel.Max - r.From) * dx));
                points.Add(new Point(_linearModel.Width - dx2, (_linearModel.Max - r.To) * dx));
                points.Add(new Point(0, (_linearModel.Max - r.To) * dx));
                points.Add(new Point(0, (_linearModel.Max - r.From) * dx));
                DrawPolygon(points, r.Brush, marginLeft, marginTop, 0.2);
            }
        }

        private Brush GetBrush(double currentValue)
        {
            Brush brush = Brushes.Black;
            if (linearModel.RangeModel == null)
                return brush;
            foreach (var r in linearModel.RangeModel)
            {
                if (currentValue >= r.From && currentValue < r.To)
                    return r.Brush;
            }
            brush = linearModel.RangeModel[linearModel.RangeModel.Count - 1].Brush;
            return brush;
        }
        private void DrawRectangle(double currentValue, double x, double y)
        {
            var rec = new Rectangle();
            rec.Stroke = Brushes.Black;
            rec.StrokeThickness = 1;
            rec.Fill = Brushes.Transparent;
            rec.Width = linearModel.Width;
            rec.Height = linearModel.Height;
            var margin = rec.Margin;
            margin.Left = x;
            margin.Top = y;
            rec.Margin = margin;
            panelLinear.Children.Add(rec);

            DrawRectangleFilter(currentValue,x,y);
            //double fillHeight = currentValue * (linearModel.Height / linearModel.Max);
            //Brush brush = GetBrush(currentValue);
            //var recFill = new Rectangle();
            //recFill.Stroke = Brushes.Black;
            //recFill.StrokeThickness = 1;
            //recFill.Fill = brush;
            //recFill.Width = linearModel.Width;
            //recFill.Height = fillHeight;
            //var margin2 = recFill.Margin;
            //margin2.Left = x;
            //margin2.Top = y + linearModel.Height - fillHeight;
            //recFill.Margin = margin2;
            //panelLinear.Children.Add(recFill);
        }

        private void DrawRectangleFilter(double currentValue, double x, double y)
        {
            double fillHeight = currentValue * (linearModel.Height / linearModel.Max);
            Brush brush = GetBrush(currentValue);
            var recFill = new Rectangle();
            recFill.Stroke = Brushes.Black;
            recFill.StrokeThickness = 1;
            recFill.Fill = brush;
            recFill.Width = linearModel.Width;
            recFill.Height = fillHeight;
            var margin2 = recFill.Margin;
            margin2.Left = x;
            margin2.Top = y + linearModel.Height - fillHeight;
            recFill.Margin = margin2;
            if(objFilter!=null)
                panelLinear.Children.Remove(objFilter);
            panelLinear.Children.Add(recFill);
            objFilter = recFill;
        }

        private void DrawLine(double x1, double y1, double x2, double y2, Brush brush, double marginLeft, double marginTop)
        {
            var line = new Line();
            line.StrokeThickness = 1;
            line.Stroke = brush;
            line.X1 = x1 + marginLeft; line.Y1 = y1 + marginTop;
            line.X2 = x2 + marginLeft; line.Y2 = y2 + marginTop;
            panelLinear.Children.Add(line);
        }
        private void DrawCursor(double currentValue, double marginLeft, double marginTop)
        {
            double x, y;
            double majorLen = linearModel.Height / linearModel.Max;
            x = marginLeft - 2;
            double ytemp = linearModel.Height - majorLen * currentValue + marginTop;
            y = Convert.ToInt32(ytemp);
            Brush brush = GetBrush(currentValue);
            DrawCursor(x, y, brush);
            x = marginLeft;
            y = linearModel.Height + marginTop + 6;
            if(objValue!=null)
                panelLinear.Children.Remove(objValue);
            objValue = DrawText("" + currentValue+" %", x, y, FontWeights.Bold, 12.0, Brushes.Black);
        }
        private TextBlock DrawText(string text, double x, double y, FontWeight fontWeight, double fontSize,Brush brush)
        {
            var textValue = new TextBlock();
            textValue.Text = text;
            textValue.SetValue(TextBlock.FontWeightProperty, fontWeight);
            textValue.SetValue(TextBlock.FontSizeProperty, fontSize);
            textValue.Foreground = brush;

            var margin = textValue.Margin;
            margin.Left = x;
            margin.Top = y;
            textValue.Margin = margin;
            panelLinear.Children.Add(textValue);
            return textValue;
        }
        private void DrawCursor(double x, double y, Brush brush)
        {
            var points = new PointCollection();
            points.Add(new Point(x, y));
            points.Add(new Point(x - 10, y + 10));
            points.Add(new Point(x - 10, y - 10));
            points.Add(new Point(x, y));
            if(objCursor!=null)
                panelLinear.Children.Remove(objCursor);
            objCursor = DrawPolygon(points, brush, 0, 0, 1.0);
        }
        private Polygon DrawPolygon(PointCollection points, Brush brush, double marginLeft, double marginTop, double opacity)
        {
            var _points = new PointCollection();
            foreach (var p in points)
            {
                _points.Add(new Point(p.X + marginLeft, p.Y + marginTop));
            }
            var polygon = new Polygon();
            polygon.Points = _points;
            polygon.Stroke = Brushes.Black;
            polygon.StrokeThickness = 1;
            polygon.Fill = brush;
            polygon.Opacity = opacity;
            panelLinear.Children.Add(polygon);
            return polygon;
        }
    }
}
