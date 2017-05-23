using CircularGauge;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Windows.Input;
using System.Windows.Threading;
using Syncfusion.UI.Xaml.Charts;
using System.Windows;
using System.Windows.Controls;
using GaugeBoard.Common;
using GaugeBoard.Interface;

namespace GaugeBoard
{
    public class MainMediator : ViewModelMediator
    {
        private ISettingProxy _settingProxy;
        private ITemperatureProxy _temperatureProxy;

        private BackgroundWorker _workerTemperature, _workerHumidity, _workerDirty;
        private const int Speed1 = 1000;
        private const int Speed2 = 1000;
        private const int Speed3 = 2000;
        private const int MaxValue1 = 100;
        private const int MaxLen = 60;
        private int _stateValue1 = 0;
        private bool _isDeactive;

        private List<ChartModel> dataChart;
        private List<ChartModel> dataChartHistory;
        private List<MonthModel> dataLine;

        private class ChartModel
        {
            public string ColumnName { get; set; }
            public int? Value1 { get; set; }
            public int? Value2 { get; set; }
            public int? Value3 { get; set; }
            public int? Value4 { get; set; }
            public int? Value5 { get; set; }
            public int? Value6 { get; set; }
        }
        private class MonthModel
        {
            public int Month { get; set; }
            public bool IsChecked { get; set; }
        }

        public MainMediator()
            : base("MainMediator")
        {
        }

        public override void OnRegister()
        {
            try
            {
                base.OnRegister();

                var mainWindow = new MainWindow();
                mainWindow.Closing += MainWindow_Closing;
                mainWindow.DataContext = this;
                ViewComponent = mainWindow;
                //App.Current.MainWindow = mainWindow;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }
        }

        private void MainWindow_Closing(object sender, CancelEventArgs e)
        {
            //_workerTemperature.CancelAsync();
            //_workerHumidity.CancelAsync();
            //_workerDirty.CancelAsync();
        }

        private MainWindow MainWindow
        {
            get { return (MainWindow) ViewComponent; }
        }

        public override IList<string> ListNotificationInterests()
        {
            return new List<string>
            {
                "MainWindow_Show",
                "Gauge1_ValueChanged",
                "Temperature1_ValueChanged",
                "Humidity1_ValueChanged",
                "mnuSetting",
                "SettingProxy",
                "mnuHome_Click",
                "mnuChart_Click",
                "AddLine_Click",
                "ViewChart_Click"
            };
        }    

    public override void HandleNotification(PureMVC.Interfaces.INotification notification)
        {
            try
            {
                switch (notification.Name)
                {
                    case "MainWindow_Show":
                        MainWindow.Show();
                        InitForm();
                        break;
                    case "mnuSetting":
                        SendNotification("ShowSetting");
                        break;
                    case "SettingProxy":
                        if (notification.Type == ProxyTypes.Ok)
                            DoLoadSetting(notification.Body as Setting);
                        break;
                    case "Gauge1_ValueChanged":
                        double newValue = Convert.ToDouble(notification.Body);
                        SetCurrentValue(MainWindow.Gauge1, newValue);
                        break;
                    case "Temperature1_ValueChanged":
                        double newValue4 = Convert.ToDouble(notification.Body);
                        SetCurrentValue(MainWindow.Temperature1, newValue4);
                        SetCurrentValue(MainWindow.Line1,Convert.ToInt32(newValue4));
                        break;
                    case "Humidity1_ValueChanged":
                        double newValue5 = Convert.ToDouble(notification.Body);
                        SetCurrentValue(MainWindow.Humidity1, newValue5);
                        break;
                    case "StatusClick":
                        var menuitem = notification.Body;
                        break;
                    case "mnuHome_Click":
                        _isDeactive = false;
                        MainWindow.RowChart.Height = new GridLength(0);
                        MainWindow.RowMain.Height = new GridLength(1.0, GridUnitType.Star);
                        break;
                    case "mnuChart_Click":
                        _isDeactive = true;
                        MainWindow.RowMain.Height = new GridLength(0);
                        MainWindow.RowChart.Height = new GridLength(1.0, GridUnitType.Star);
                        break;
                    //case "AddLine_Click":
                        //break;
                    case "ViewChart_Click":
                        DoView_ChartHistory();
                        break;
                }
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }
        }

        #region Fields
        //private Visibility _processing;
        //public Visibility Processing
        //{
        //    get { return _processing; }
        //    set
        //    {
        //        _processing = value;
        //        RaisePropertyChanged("Processing");
        //    }
        //}        
        #endregion

        #region Commands

        public ICommand RemoveCommand
        {
            get
            {
                return new RelayCommand(new Action<object>(this.RemoveClick));
            } 
        }      
        public ICommand cmdSetting
        {
            get
            {
                return new RelayCommand(obj =>
                {
                    SendNotification("mnuSetting");
                });
            }
        }
        public ICommand cmdHome
        {
            get
            {
                return new RelayCommand(obj =>
                {
                    SendNotification("mnuHome_Click");
                });
            }
        }
        public ICommand cmdChart
        {
            get
            {
                return new RelayCommand(obj =>
                {
                    SendNotification("mnuChart_Click");
                });
            }
        }
        public ICommand cmdAddLine
        {
            get
            {
                return new RelayCommand(obj =>
                {
                    SendNotification("AddLine_Click");
                });
            }
        }
        public ICommand cmdViewChart
        {
            get
            {
                return new RelayCommand(obj =>
                {
                    SendNotification("ViewChart_Click");
                });
            }
        }
        private void RemoveClick(Object button)
        {
            //var p = button as Button;
            //var m = (int) p.Tag;
            //var line = dataLine.Single(x => x.No == m);
            //dataLine.Remove(line);
            //MainWindow.lvLine.Items.Refresh();
        }

        public override int Priority
        {
            get
            {
                return 1;
            }
        }
        #endregion
        
        #region myfunc

        private void DoView_ChartHistory()
        {
            string msg;
            int year;
            bool f = int.TryParse(MainWindow.txtYear.Text, out year);
            if(!f) throw new Exception("Input wrong year value");
            if(!dataLine.Any(x=>x.IsChecked)) throw new Exception("Missing select month");
            var months = dataLine.Where(x=>x.IsChecked).Select(x => x.Month).ToList();

            //var p = months.GroupBy(x => x).Select(g => new {value = g.Key, count = g.Count()}).ToList();
            //if(p.Exists(x=>x.count>1)) throw new Exception("Do not repeat Month");

            var temps = _temperatureProxy.Get(year, months, out msg);
            if(msg!="") throw new Exception(msg);
            temps = temps.OrderBy(x => x.DateTime).ToList();
            dataChartHistory =new List<ChartModel>();
            int month,k;
            string cname;
            bool isNew;
            ChartModel model;
            foreach (var t in temps)
            {
                isNew = false;
                cname = t.DateTime.ToString("d-H:m");
                if (dataChartHistory.Any(x => x.ColumnName == cname))
                    model = dataChartHistory.Single(x => x.ColumnName == cname);
                else
                {
                    model = new ChartModel(){ColumnName = cname};
                    isNew = true;
                }
                month = t.DateTime.Month;
                var line = months.Single(x => x == month);
                k= months.IndexOf(line);
                switch (k)
                {
                    case 0:
                        model.Value1 = Convert.ToInt32(t.Value);
                        break;
                    case 1:
                        model.Value2 = Convert.ToInt32(t.Value);
                        break;
                    case 2:
                        model.Value3 = Convert.ToInt32(t.Value);
                        break;
                    case 3:
                        model.Value4 = Convert.ToInt32(t.Value);
                        break;
                    case 4:
                        model.Value5 = Convert.ToInt32(t.Value);
                        break;
                    case 5:
                        model.Value6 = Convert.ToInt32(t.Value);
                        break;
                    default:
                        break;
                }
                if(isNew)
                    dataChartHistory.Add(model);
            }
            ((ItemsControl) MainWindow.ChartHistory1.Legend).Visibility = Visibility.Visible;
            foreach (LegendItem legend in ((ItemsControl)MainWindow.ChartHistory1.Legend).Items)
            {
                legend.VisibilityOnLegend = Visibility.Collapsed;
                MainWindow.LineHistory1.ItemsSource = null;
                MainWindow.LineHistory2.ItemsSource = null;
                MainWindow.LineHistory3.ItemsSource = null;
                MainWindow.LineHistory4.ItemsSource = null;
                MainWindow.LineHistory5.ItemsSource = null;
                MainWindow.LineHistory6.ItemsSource = null;
            }
            for (int i = 0; i < months.Count; i++)
            {
                LegendItem legend = ((ItemsControl)MainWindow.ChartHistory1.Legend).Items[i] as LegendItem;
                legend.VisibilityOnLegend =  Visibility.Visible;
                switch (i)
                {
                    case 0:                        
                        MainWindow.LineHistory1.Label = "Month " + months[i];
                        MainWindow.LineHistory1.ItemsSource = dataChartHistory;
                        break;
                    case 1:
                        MainWindow.LineHistory2.Label = "Month " + months[i];
                        MainWindow.LineHistory2.ItemsSource = dataChartHistory;
                        break;
                    case 2:
                        MainWindow.LineHistory3.Label = "Month " + months[i];
                        MainWindow.LineHistory3.ItemsSource = dataChartHistory;
                        break;
                    case 3:
                        MainWindow.LineHistory4.Label = "Month " + months[i];
                        MainWindow.LineHistory4.ItemsSource = dataChartHistory;
                        break;
                    case 4:
                        MainWindow.LineHistory5.Label = "Month " + months[i];
                        MainWindow.LineHistory5.ItemsSource = dataChartHistory;
                        break;
                    case 5:
                        MainWindow.LineHistory6.Label = "Month " + months[i];
                        MainWindow.LineHistory6.ItemsSource = dataChartHistory;
                        break;
                }
            }
            MainWindow.ChartHistory1.Header = "Year "+ year;
        }
        private void InitForm()
        {
            _settingProxy = (ISettingProxy) Facade.RetrieveProxy(ProxyNames.SettingProxy);
            _temperatureProxy = (ITemperatureProxy)Facade.RetrieveProxy(ProxyNames.TemperatureProxy);

            dataLine=new List<MonthModel>()
            {
                new MonthModel() { Month = 1},
                new MonthModel() { Month = 2},
                new MonthModel() { Month = 3},
                new MonthModel() { Month = 4},
                new MonthModel() { Month = 5},
                new MonthModel() { Month = 6},
                new MonthModel() { Month = 7},
                new MonthModel() { Month = 8},
                new MonthModel() { Month = 9},
                new MonthModel() { Month = 10},
                new MonthModel() { Month = 11},
                new MonthModel() { Month = 12},
            };
            MainWindow.lbxMonth.ItemsSource = dataLine;
            dataChart = new List<ChartModel>();
            for (int i = 0; i < MaxLen; i++)
            {
                dataChart.Add(new ChartModel() {ColumnName = "" + i, Value1 = null});
            }
            string msg;
            var dataSetting = _settingProxy.Get(out msg);
            if (msg != "") throw new Exception(msg);
            LoadSetting(dataSetting);

            _workerDirty = new BackgroundWorker();
            _workerDirty.WorkerReportsProgress = true;
            _workerDirty.WorkerSupportsCancellation = true;
            _workerDirty.DoWork += WorkerDirty_DoWork;
            if (!_workerDirty.IsBusy)
                _workerDirty.RunWorkerAsync();

            _workerTemperature = new BackgroundWorker();
            _workerTemperature.WorkerReportsProgress = true;
            _workerTemperature.WorkerSupportsCancellation = true;
            _workerTemperature.DoWork += WorkTemperature_DoWork;
            if (!_workerTemperature.IsBusy)
                _workerTemperature.RunWorkerAsync();

            _workerHumidity = new BackgroundWorker();
            _workerHumidity.WorkerReportsProgress = true;
            _workerHumidity.WorkerSupportsCancellation = true;
            _workerHumidity.DoWork += WorkerHumidity_DoWork;
            if (!_workerHumidity.IsBusy)
                _workerHumidity.RunWorkerAsync();

            //pabel Chart
            MainWindow.txtYear.Text = ""+DateTime.Today.Year;
        }

        private void WorkerDirty_DoWork(object sender, DoWorkEventArgs e)
        {
            double min, max;
            int minValue =0, maxValue=0;
            var obj = sender as BackgroundWorker;
            var r = new Random();
            MainWindow.Gauge1.Dispatcher.Invoke(DispatcherPriority.Normal,
                    new Action(delegate ()
                    {
                        min = MainWindow.Gauge1.MinValue;
                        max = MainWindow.Gauge1.MaxValue;
                        minValue = Convert.ToInt32(min);
                        maxValue = Convert.ToInt32(max*10);
                    }));
            while (true)
            {
                if (obj.CancellationPending) return;
                Thread.Sleep(Speed1);
                int m = r.Next(minValue, maxValue);
                double newValue = 1.0*m/10;
                //obj.ReportProgress(0, newValue);
                SendNotification("Gauge1_ValueChanged", newValue);
            }
        }
        private void WorkTemperature_DoWork(object sender, DoWorkEventArgs e)
        {
            double min, max;
            int minValue = 0, maxValue = 0;
            var obj = sender as BackgroundWorker;
            var r = new Random();
            MainWindow.Temperature1.Dispatcher.Invoke(DispatcherPriority.Normal,
                    new Action(delegate ()
                    {
                        min = MainWindow.Temperature1.MinValue;
                        max = MainWindow.Temperature1.MaxValue;
                        minValue = Convert.ToInt32(min);
                        maxValue = Convert.ToInt32(max);
                    }));
            while (true)
            {
                if (obj.CancellationPending) return;
                Thread.Sleep(Speed1);
                int newValue = r.Next(minValue, maxValue);
                //double newValue = 1.0*m/10;
                //obj.ReportProgress(0, newValue);
                SendNotification("Temperature1_ValueChanged", newValue);
            }
        }
        private void WorkerHumidity_DoWork(object sender, DoWorkEventArgs e)
        {
            double min, max;
            int minValue = 0, maxValue = 0;
            var obj = sender as BackgroundWorker;
            var r = new Random();
            MainWindow.Humidity1.Dispatcher.Invoke(DispatcherPriority.Normal,
                    new Action(delegate ()
                    {
                        min = MainWindow.Humidity1.MinValue;
                        max = MainWindow.Humidity1.MaxValue;
                        minValue = Convert.ToInt32(min);
                        maxValue = Convert.ToInt32(max);
                    }));
            while (true)
            {
                if (obj.CancellationPending) return;
                Thread.Sleep(Speed3);
                int newValue = r.Next(minValue, maxValue);
                //double newValue = 1.0*m/10;
                //obj.ReportProgress(0, newValue);
                SendNotification("Humidity1_ValueChanged", newValue);
            }
        }
        private void SetCurrentValue(CircularGaugeControl control, double value)
        {
            if (_isDeactive) return;
            control.Dispatcher.Invoke(DispatcherPriority.Normal,
                    new Action(delegate ()
                    {
                        control.CurrentValue = value;
                        control.DialText = ""+value;
                    }));
        }
        private void SetCurrentValue(ctrTemperature control, double value)
        {
            if (_isDeactive) return;
            control.Dispatcher.Invoke(DispatcherPriority.Normal,
                    new Action(delegate ()
                    {
                        control.CurrentValue = value;
                    }));
        }
        private void SetCurrentValue(CtrLinear control, double value)
        {
            if (_isDeactive) return;
            control.Dispatcher.Invoke(DispatcherPriority.Normal,
                    new Action(delegate (){
                        control.CurrentValue = value;
                    }));
        }
        private void SetCurrentValue(LineSeries control, int value)
        {
            //add row to database
            //set datasource chart view

            string msg;
            var model = new Temperature() { DateTime = DateTime.Now, Value = value };
            _temperatureProxy.Add(model, out msg);
            if (msg != "") throw new Exception(msg);

            if (_stateValue1 < MaxLen)
            {
                dataChart[_stateValue1].Value1 = value;
                _stateValue1++;
            }
            else
            {
                for (int i = 0; i < MaxLen - 1; i++)
                {
                    dataChart[i].Value1 = dataChart[i + 1].Value1;
                }
                dataChart[MaxLen - 1].Value1 = value;
            }
            if (_isDeactive) return;
            control.Dispatcher.Invoke(DispatcherPriority.Normal,
                    new Action(delegate () {
                        control.ItemsSource = null;
                        control.ItemsSource = dataChart;
                    }));
        }

        private void DoLoadSetting(Setting s)
        {
            _isDeactive = true;
            LoadSetting(s);
            _isDeactive = false;
        }

        private void LoadSetting(Setting s)
        {
            //MainWindow.Temperature1.MinValue = 0;
            //MainWindow.Temperature1.MaxValue = 100;
            //MainWindow.Temperature1.CurrentValue = 0;
            MainWindow.Temperature1.RangeValue = s.MaxTemperature;

            //MainWindow.Humidity1.MinValue = 0;
            //MainWindow.Humidity1.MaxValue = 100;
            //MainWindow.Humidity1.CurrentValue = 0;
            MainWindow.Humidity1.RangeValue = s.MaxHumidity;

            //MainWindow.Gauge1.OptimalRangeStartValue = 0;
            MainWindow.Gauge1.OptimalRangeEndValue = s.MaxDirty - 0.01;
            //MainWindow.Gauge1.MinValue = 0;
            //MainWindow.Gauge1.MaxValue = 0.5;
            //MainWindow.Gauge1.CurrentValue = 0;
            //MainWindow.Gauge1.RenderSize();
        }
        #endregion
    }
}