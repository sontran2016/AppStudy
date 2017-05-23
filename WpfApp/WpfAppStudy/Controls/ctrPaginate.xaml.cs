using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace WpfApplication.Controls
{
    public delegate void OnPageClick_Delegate(int pageIndex, int pageSize);
    /// <summary>
    /// Interaction logic for ctrPaginate.xaml
    /// </summary>
    public partial class CtrPaginate : UserControl
    {
        public event OnPageClick_Delegate OnPageClick;

        private const int NumberLen = 5;
        private int _pageIndex, _rowCount;

        private int _pageSize;
        public int PageSize {
            get { return _pageSize; }
            set
            {
                if (_pageSize != value)
                {
                    _pageSize = value;
                    double m = Math.Ceiling(1.0 * _rowCount / _pageSize);
                    PageCount = Convert.ToInt32(m);                    
                }
            }
        }
        private int _pageCount;
        public int PageCount
        {
            get { return _pageCount; }
            set
            {
                if (_pageCount != value)
                {
                    _pageCount = value;
                    tboxPages.Text = string.Format("of {0} pages", _pageCount);
                }
            }
        }


        public CtrPaginate()
        {
            InitializeComponent();

            cboPageSize.SelectedIndex = 0;
            PageSize = int.Parse(cboPageSize.Text);
        }
        public void SetPageCurrent(int pageIndex, int rowCount)
        {
            if (_rowCount == rowCount && _pageIndex == pageIndex)
                return;
            if (_rowCount != rowCount)
            {
                _rowCount = rowCount;
                double m = Math.Ceiling(1.0 * _rowCount / PageSize);
                PageCount = Convert.ToInt32(m);
            }
            if (_pageIndex != pageIndex)
            {
                _pageIndex = pageIndex;
                txtPageIndex.Text = "" + _pageIndex;
            }
            ShowButton(_pageIndex);
        }

        private void OnPageIndexChanged()
        {
            int pIndex;
            if (txtPageIndex.Text == "" + _pageIndex) return;
            bool b = int.TryParse(txtPageIndex.Text, out pIndex);
            if (b && pIndex > 0 && pIndex <= PageCount)
            {
                OnPageClick(pIndex, PageSize);
            }
            else
                txtPageIndex.Text = "" + _pageIndex;
        }
        private void OnPageSizeChanged()
        {
            int pSize;
            if (cboPageSize.Text == "" + PageSize) return;
            bool b = int.TryParse(cboPageSize.Text, out pSize);
            if (b && pSize>0)
            {
                PageSize = pSize;
                OnPageClick(1, PageSize);
            }
            else
                cboPageSize.Text = "" + PageSize;
        }
        private void Btn_OnClick(object sender, RoutedEventArgs e)
        {
            int pIndex=1;
            Button btn=sender as Button;
            string buttonName = btn.Name;
            switch (buttonName)
            {
                case "btnFirst":
                    pIndex = 1;
                    break;
                case "btnPrevious":
                    pIndex = _pageIndex-1;
                    break;
                case "btnPreGroup":
                    var igroup1 = Math.Ceiling(1.0 * _pageIndex / NumberLen);
                    var numStart = (igroup1 - 2) * NumberLen + 1;
                    pIndex = (int)numStart;
                    break;
                case "btnLast":
                    pIndex = PageCount;
                    break;
                case "btnNext":
                    pIndex = _pageIndex+1;
                    break;
                case "btnNextGroup":
                    var igroup2 = Math.Ceiling(1.0 * _pageIndex / NumberLen);
                    var numStart2 = igroup2 * NumberLen + 1;
                    pIndex = (int)numStart2;
                    break;
                default:
                    pIndex = Convert.ToInt32(btn.Content);
                    break;
            }
            if (OnPageClick != null)
                OnPageClick(pIndex, PageSize);
        }
        private void ShowButton(int pageIndex)
        {
            if (pageIndex > 1)
            {
                btnFirst.Visibility = Visibility.Visible;
                btnPrevious.Visibility = Visibility.Visible;
            }
            else
            {
                btnFirst.Visibility = Visibility.Collapsed;
                btnPrevious.Visibility = Visibility.Collapsed;
            }
            if (pageIndex < PageCount)
            {
                btnLast.Visibility = Visibility.Visible;
                btnNext.Visibility = Visibility.Visible;
            }
            else
            {
                btnLast.Visibility = Visibility.Collapsed;
                btnNext.Visibility = Visibility.Collapsed;
            }
            if (pageIndex > NumberLen)
                btnPreGroup.Visibility = Visibility.Visible;
            else
                btnPreGroup.Visibility = Visibility.Collapsed;
            var m = Math.Ceiling(1.0 * pageIndex / NumberLen) * NumberLen;
            if (PageCount > m)
                btnNextGroup.Visibility = Visibility.Visible;
            else
                btnNextGroup.Visibility = Visibility.Collapsed;
            //buttons number
            var childs = panelNumber.Children;
            var igroup = Math.Ceiling(1.0 * pageIndex / NumberLen);
            var numStart = (igroup - 1) * NumberLen + 1;
            int bCount = 0;
            for (double i = numStart; i < numStart + NumberLen; i++)
            {
                if (i > PageCount)
                {
                    while (childs.Count > bCount)
                    {
                        childs.RemoveAt(bCount);
                    }
                    break;
                }
                Button btn;
                if (childs.Count > bCount)
                {
                    btn = childs[bCount] as Button;
                }
                else
                {
                    btn = new Button();
                    btn.Click += Btn_OnClick;
                    childs.Add(btn);
                }
                btn.Content = "" + i;
                bCount++;
                if (i == pageIndex)
                    btn.Style = this.FindResource("styleButtonActive") as Style;
                else
                    btn.Style = btnFirst.Style;
            }
        }

        private void txtPageIndex_LostFocus(object sender, RoutedEventArgs e)
        {
            OnPageIndexChanged();
        }
        private void txtPageIndex_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
                OnPageIndexChanged();
        }
        private void cboPageSize_LostFocus(object sender, RoutedEventArgs e)
        {
            OnPageSizeChanged();
        }
        private void cboPageSize_KeyUp(object sender, KeyEventArgs e)
        {
            if(e.Key==Key.Enter)
                OnPageSizeChanged();
        }        
        private void CboPageSize_OnDropDownClosed(object sender, EventArgs e)
        {
            OnPageSizeChanged();
        }
    }
}
