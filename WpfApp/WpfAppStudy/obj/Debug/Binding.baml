   M S B A M L   `   `   `  ����I  EWpfApplication, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null/clr-namespace:WpfApplicationWpfApplication  5   	       WpfApplication.Binding   5   	   \ XPresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35W SPresentationCore, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35R NWindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35D 9http://schemas.microsoft.com/winfx/2006/xaml/presentation    5   	   R NSystem.Xaml, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5   	   @d2http://schemas.microsoft.com/expression/blend/2008     5   	   Jmc;http://schemas.openxmlformats.org/markup-compatibility/2006     5   	   .localclr-namespace:WpfApplication     5   	     � Title$  Binding��5   	   $	��723��6   $	��605��6&    � WindowStartupLocation$ CenterScreen=�62   .��5	      �� .+�5
   
   �� $��10q�6   .+�5      �� .��6   Bing ding element6'   �� 5      -   5        $��txtValue��5      � 5      $
��0,10q�6   .+�5      �� $��Value: ��6   �� 5      ��6   ��  �� Path$
 Text� �� ElementName$ txtValue��5      5      �� 5   
   $��10q�6   .+�5      �� .��6   Binding context6%   � 5      .+�5      �� $��Window title:  ��6   �� 5      -   5        $��txtWindowTitle��5      $	��150��6e   ��60   �� *Title+ �� UpdateSourceTrigger$ Explicit=�6e   �� 5      -   5        $��btnUpdateSource��5      $	��5,0q�6N   $	��5,0q�6[   .��6i   *6l   5      � 5      $��0,10,0,0q�6   .+�5      �� $��Window dimensions: ��6   �� 5      $��50��6V   ��6   �� *Width+$ PropertyChanged=�6V   �� 5      $	�� x ��6   �� 5      $��50��6Q   ��6   �� *Height+$ 	LostFocus=�6Q   5      5      �� 5    
   .��6   ItemsSource6   ]� 5!   
   $��10q�6   .+�5"      �� $��Right=�6   $��10,0,0,0q�60   .+�5#      �� -   5        $��
btnAddUser��5#      .��6D   
Add user6N   �� 5$      -   5        $��btnChangeUser��5$      $	��0,5q�6J   .��6W   Change user6d   �� 5%      -   5        $��btnDeleteUser��5%      .��6J   Delete user6W   5&      �� 5'      -   5        $��lbUsers��5'       �� DisplayMemberPath$
 Name��6%   6@   5(      �� 5)   
   .��6   	Binding6   ]� 5*   
   $��10q�6   .+�5+      �� $��Right=�6   $��10,0,0,0q�60   .+�5,      �� -   5        $��btnAddUser2��5,      .��6F   
Add user6P   �� 5-      -	   5        $��btnChangeUser2��5-      $	��0,5q�6L   .��6Y   Change user6f   �� 5.      -
   5        $��btnDeleteUser2��5.      .��6L   Delete user6Y   5/      �� 50      -   5        $��lbUsers2��50      $
 Name��6&   ��6?   �� *users2+6`   51      �� 52   
   .��6   
ListView6   ]� 53   
   $��10q�6   .+�54      �� $��Right=�6   $��10,0,0,0q�60   .+�55      �� -   5        $��btnAddUser3��55      .��6F   
Add user6P   �� 56      -   5        $��btnChangeUser3��56      $	��0,5q�6L   .��6Y   Change user6f   �� 57      -   5        $��btnDeleteUser3��57      .��6L   Delete user6Y   58      �� 59      -   5        $��lvUsers��59      ��5:      �� 5;       �� 
TargetType" ��6   .�5<      ��  �� Property � �� �� Value$ Stretch=�6G   5=      	 �� View	 5?      �� 5@      .P�5B      �� $
��Name��6)   
 �� Width$	
 120��67    �� CellTemplate 5C      �� 5D   "   .R�5E   &   �� $��Stretch=�6n   $��Stretch=�6�   ��6.   �� $
 Name�$ PropertyChanged=�6�   5F   #   5H      �� 5I      $	��Age��6)   $
 50��66    5J      �� 5K   "   .R�5L   &   ��  �� TextAlignment$ Right=�6C   ��6.   �� *Age+6C   5M   #   5O      �� 5P      $
��Mail��6)   $	
 150��67    5Q      �� 5R   "   .R�5S   &   ��  �� TextDecorations$ 	Underline{�6D   
����  � � Cursor$
 Hand��6r   ��6.   �� *Mail+6r   5T   #   5V      5W      5Y      5Z      �� 5[   
    �� Orientation$ 
Horizontal=�6   .+�5\      �� Age:6   �� 5]      -   5        $��txtName��5]      $	��100��6^   ��6%   �� $
 Name�$ Explicit=�6l   �� 5^      -   5        $��btnOK��5^      $
��10,0q�6"   .��6D   OK6H   5_      5b      5c      