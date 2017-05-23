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
    /// Interaction logic for ctrTemperature.xaml
    /// </summary>
    public partial class ctrTemperature : UserControl
    {
        private const double _RangeValue = 10;
        private LinearModel linearModel;
        private class LinearModel
        {
            public double min { get; set; }
            public double max { get; set; }
            public double value { get; set; }
            public List<RangeModel> rangeModel { get; set; }
        }
        private class RangeModel
        {
            public double from { get; set; }
            public double to { get; set; }
            public Brush brush { get; set; }
        }
        public ctrTemperature()
        {
            InitializeComponent();
            linearModel = new LinearModel() { max = 100, value=0};
            var rangeModel = new List<RangeModel>();
            rangeModel.Add(new RangeModel { from = 0, to = 50, brush = Brushes.Green });
            rangeModel.Add(new RangeModel { from = 50, to = 100, brush = Brushes.Red });
            linearModel.rangeModel = rangeModel;

            DrawRule(linearModel.max);
            this.CurrentValue = 20;
        }

        private void UserControl_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            double h = this.ActualHeight - 55;
            if (h > 0 && TempHeight.Height != h)
            {
                TempHeight.Height = h;
                Rule1.Height = h;
                DrawRule(linearModel.max);
            }
        }
        public double CurrentValue
        {
            get { return linearModel.value; }
            set {
                if (value >= 0 && value <= linearModel.max && linearModel.value != value)
                {
                    linearModel.value = value;
                    DrawCurrentValue(value);
                }
            }
        }

        public double MinValue
        {
            get { return linearModel.min; }
            set { linearModel.min = value; }
        }
        public double MaxValue
        {
            get { return linearModel.max; }
            set { linearModel.max = value; }
        }
        public double RangeValue
        {
            get { return linearModel.rangeModel.First().to; }
            set
            {
                linearModel.rangeModel.First().to = value;
                linearModel.rangeModel.Last().from = value;
                DrawRule(linearModel.max);
            }
        }

        private void DrawCurrentValue(double value)
        {
            Value1.Text = string.Format("{0} °C", value);
            ValueFilter1.Height = value * Rule1.Height / linearModel.max;
            Brush brush = GetBrush(value);
            ValueFilter1.Fill = brush;
            ValueFilter2.Fill = brush;
        }
        private void DrawRanges(List<RangeModel> ranges)
        {
            var r1 = ranges.First();
            var r2 = ranges.Last();

            double dx = (10 * r1.to / r2.to)+10;
            double h = Rule1.Height;
            var dy = h / linearModel.max;

            var points = new PointCollection();
            points.Add(new Point(0, 0));
            points.Add(new Point(20, 0));
            points.Add(new Point(dx, dy * (r2.to - r2.from)));
            points.Add(new Point(0, dy * (r2.to - r2.from)));
            points.Add(new Point(0, 0));
            DrawPolygon(points, r2.brush);

            points = new PointCollection();
            points.Add(new Point(0, dy * (r2.to - r2.from)));
            points.Add(new Point(dx, dy * (r2.to - r2.from)));
            points.Add(new Point(10,h));
            points.Add(new Point(0,h));
            points.Add(new Point(0, dy * (r2.to - r2.from)));
            DrawPolygon(points, r1.brush);
        }
        private void DrawRule(double maxValue)
        {
            Rule1.Children.Clear();

            double numRange = maxValue / _RangeValue;
            double h = Rule1.Height;
            double majorLen = h / numRange;
            double minorLen = majorLen / 4;

            int marginLeft = 0, marginTop = 0;
            DrawLine(0, 0, 0, h, Brushes.Blue, marginLeft, marginTop);
            double x1 = 0, x2 = 20;
            double y1 = 0, y2 = 0;
            for (int i = 0; i <= numRange; i++)
            {
                DrawLine(x1, y1, x2, y2, Brushes.Red, marginLeft, marginTop);
                if (i < numRange)
                {
                    for (int j = 1; j < 4; j++)
                    {
                        DrawLine(x1, y1 + minorLen * j, x2 / 2, y2 + minorLen * j, Brushes.Black, marginLeft, marginTop);
                    }
                }
                DrawText((_RangeValue*(numRange - i)).ToString(), 22, y1 + marginTop - 8, FontWeights.Normal, 12.0);
                y1 = y2 = y1 + majorLen;
            }
            DrawRanges(linearModel.rangeModel);
            ValueFilter1.Height = linearModel.value * Rule1.Height / linearModel.max;
        }
        private void DrawText(string text, double x, double y, FontWeight fontWeight, double fontSize)
        {
            var textValue = new TextBlock();
            textValue.Text = text;
            textValue.SetValue(TextBlock.FontWeightProperty, fontWeight);
            textValue.SetValue(TextBlock.FontSizeProperty, fontSize);

            var margin = textValue.Margin;
            margin.Left = x;
            margin.Top = y;
            textValue.Margin = margin;
            Rule1.Children.Add(textValue);
        }
        private void DrawLine(double x1, double y1, double x2, double y2, Brush brush, int marginLeft, int marginTop)
        {
            var line = new Line();
            line.StrokeThickness = 1;
            line.Stroke = brush;
            line.X1 = x1 + marginLeft; line.Y1 = y1 + marginTop;
            line.X2 = x2 + marginLeft; line.Y2 = y2 + marginTop;
            Rule1.Children.Add(line);
        }
        private void DrawPolygon(PointCollection points,Brush brush)
        {
            var polygon = new Polygon();
            polygon.Points = points;
            polygon.Stroke = brush;
            polygon.StrokeThickness = 1;
            polygon.Fill = brush;
            polygon.Opacity = 0.3;
            Rule1.Children.Add(polygon);
        }
        private Brush GetBrush(double curentValue)
        {
            Brush brush = Brushes.Blue;
            if (linearModel.rangeModel == null)
                return brush;
            foreach (var r in linearModel.rangeModel)
            {
                if (curentValue >= r.from && curentValue < r.to)
                    return r.brush;
            }
            brush = linearModel.rangeModel[linearModel.rangeModel.Count - 1].brush;
            return brush;
        }
    }
}